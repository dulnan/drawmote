<template>
  <transition
    v-on:leave="leave"
    v-on:after-leave="onAfterLeave"
  >
    <div class="animation" :class="{ 'is-desktop': isDesktop }">
      <div class="three-animation" ref="container"></div>
      <slot></slot>
      <div class="ratio" v-if="debug">{{ ratio }}</div>
      <div class="debug-range" v-if="debug">
        <input type="range" min="0" max="100" step="0.001" value="0" @input="handleRange">
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'

import Drawing from '@/components/Desktop/Drawing.vue'
import ThreeAnimation from '@/tools/animation'
import { getViewportSize } from '@/tools/helpers'
import { ANIMATION_SCREEN_VIEWPORT } from '@/settings'

import debouncedResize from 'debounced-resize'

export default {
  name: 'Animation',

  components: {
    Drawing
  },

  props: {
    isDrawing: Boolean,
    isDesktop: Boolean
  },

  data () {
    return {
      isRendered: false,

      x: 180,
      y: 0,

      windowWidth: 958,
      windowHeight: 542,

      count: 0,

      mouseEnabled: true,
      sceneVisible: true,

      debug: false
    }
  },

  computed: {
    ...mapState(['isConnected', 'isSkipped']),

    ratio () {
      return this.windowWidth / this.windowHeight
    }
  },

  watch: {
    brush (coordinates) {
      if (coordinates) {

      }
    },

    x (x) {
      this.updateRotation(x, this.y)
    },

    y (y) {
      this.updateRotation(this.x, y)
    }
  },

  methods: {
    loop () {
      const orientation = this.$mote.gyroscope.getOrientation(100)

      this.animation.setPhoneRotationFromGyro(orientation)
      this.getIntersection()

      window.requestAnimationFrame(this.loop)
    },
    leave (el, done) {
      this.animation.animateLeave(() => {
        done()
      })
    },

    onAfterLeave () {
      this.instance.$destroy()
      this.instance.$el.remove()
      this.instance = null
      this.animation.dispose()
    },

    handleRange (e) {
      this.animation.seekAnimation(e.target.value)
    },

    updateRotation (x, y) {
      this.animation.setPhoneRotationFromMouse(x, y)
      this.getIntersection()
    },

    getIntersection () {
      const coordinates = this.animation.getIntersection()
      if (!coordinates) return
      this.$vuetamin.store.mutate('updatePointer', { coordinates })
    },

    onMouseMove (e) {
      if (!this.mouseEnabled) {
        return
      }
      // e.preventDefault()
      this.setOrientation(e.pageX, e.pageY)
    },

    onMouseDown (e) {
      if (!this.mouseEnabled) {
        return
      }
      // e.preventDefault()
      this.$vuetamin.store.mutate('updateIsPressing', { isPressing: true })
    },

    onMouseUp (e) {
      if (!this.mouseEnabled) {
        return
      }
      // e.preventDefault()
      this.$vuetamin.store.mutate('updateIsPressing', { isPressing: false })
    },

    setOrientation (x, y) {
      this.x = x / this.windowWidth
      this.y = y / this.windowHeight
    },

    updateSizes () {
      this.windowWidth = window.innerWidth
      this.windowHeight = window.innerHeight
    }
  },

  mounted () {
    this.updateSizes()

    debouncedResize((e) => {
      this.updateSizes()
      this.animation.setSize(this.windowWidth, this.windowHeight)
    })

    this.animation = new ThreeAnimation(this.$refs.container, ANIMATION_SCREEN_VIEWPORT, this.isDesktop, this.debug)

    const screen = this.animation.getScreen()
    const DrawingCtor = this.$root.constructor.extend(Drawing)
    this.instance = new DrawingCtor({
      parent: this,
      propsData: {
        showToolbar: true,
        isDrawing: false
      }
    }).$mount(screen)

    this.animation.play()
    this.animation.setSize(this.windowWidth, this.windowHeight)

    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mousedown', this.onMouseDown)
    window.addEventListener('mouseup', this.onMouseUp)

    if (!this.isDesktop) {
      this.loop()
    }
  },

  destroyed () {
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('mousedown', this.onMouseDown)
    window.removeEventListener('mouseup', this.onMouseUp)
  }
}
</script>

<style lang="scss">
.debug-range {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  padding: 1rem;
  padding-bottom: 4rem;
  // display: none;
}

.three-animation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  .is-desktop & {
    width: 100%;
    height: 100%;
  }
}

.renderer-webgl,
.renderer-css {
  position: relative;
  top: 0;
  left: 0;
  z-index: 10;
}

.renderer-webgl {
  z-index: 15;
}

.renderer-css {
  &, canvas {
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
  }
}

.dg.ac {
  z-index: 999999;
  @include media('sm', $breakpoints-desc) {
    top: 100vw;
  }
}

#screen {
  background: red;
}

.screen-wrapper {
  transform-origin: top left;
  position: relative;
  height: 100%;
  width: 100%;

}

.ratio {
  position: fixed;
  top: 0;
  left: 0;
  padding: 2rem;
  font-size: 2rem;
  font-weight: bold;
  z-index: 99999999;
}
</style>
