<template>
  <div class="animation" :class="{ 'is-desktop': isDesktop }">
    <div class="three-animation" ref="container"></div>
    <slot></slot>
    <div class="ratio" v-if="debug">{{ ratio }}</div>
    <div class="debug-range" v-if="debug">
      <input type="range" min="0" max="100" step="0.001" value="0" @input="handleRange">
    </div>
  </div>
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

      alpha: 180,
      beta: 0,

      windowWidth: 958,
      windowHeight: 542,

      count: 0,

      mouseEnabled: true,
      sceneVisible: true,

      debug: false
    }
  },

  computed: {
    ...mapState(['isConnected']),

    ratio () {
      return this.windowWidth / this.windowHeight
    }
  },

  watch: {
    brush (coordinates) {
      if (coordinates) {

      }
    },

    alpha (alpha) {
      this.updateRotation(alpha, this.beta)
    },

    beta (beta) {
      this.updateRotation(this.alpha, beta)
    }
  },

  methods: {
    handleRange (e) {
      this.animation.seekAnimation(e.target.value)
    },
    updateRotation (alpha, beta) {
      const coordinates = this.animation.setPhoneRotation(alpha, beta)
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
      this.alpha = -(x - (this.windowWidth / 2)) / (this.windowWidth / 2)
      this.beta = -(y - (this.windowHeight / 2)) / (this.windowHeight / 2)
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

    this.animation = new ThreeAnimation(this.$refs.container, ANIMATION_SCREEN_VIEWPORT, this.isDesktop)
    this.animation.setSize(window.innerWidth, window.innerHeight)

    const screen = this.animation.getScreen()
    const DrawingCtor = this.$root.constructor.extend(Drawing)
    this.instance = new DrawingCtor({
      parent: this,
      propsData: {
        showToolbar: true
      }
    }).$mount(screen)

    this.animation.play()

    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mousedown', this.onMouseDown)
    window.addEventListener('mouseup', this.onMouseUp)
  },

  beforeDestroy () {
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('mousedown', this.onMouseDown)
    window.removeEventListener('mouseup', this.onMouseUp)

    this.instance.$destroy()
    this.instance.$el.remove()
    this.instance = null
    this.animation.dispose()
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
  position: absolute;
  top: 0;
  left: 0;
width: 100vw;
  height: 100vw;
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
  @include media('md', $breakpoints-desc) {
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
