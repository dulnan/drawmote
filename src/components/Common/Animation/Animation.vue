<template>
  <transition name="appear" @after-leave="onAfterLeave">
    <div
      class="animation"
      :class="{ 'is-desktop': isDesktop, 'is-fallback': useFallback }"
    >
      <div ref="container" class="three-animation"></div>
      <slot></slot>
      <div v-if="debug" class="ratio">{{ ratio }}</div>
      <div v-if="debug" class="debug-range">
        <input
          type="range"
          min="0"
          max="100"
          step="0.001"
          value="0"
          @input="handleRange"
        />
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'

import Drawing from '@/components/Desktop/Drawing.vue'
import ThreeAnimation from '@/tools/animation'

import webglIsSupported from '@/tools/animation/webglSupport'

import { ANIMATION_SCREEN_VIEWPORT } from '@/settings'
import threads from '@/store/vuetamin/threads'

import debouncedResize from 'debounced-resize'

export default {
  name: 'Animation',

  props: {
    isDrawing: Boolean,
    isDesktop: Boolean,
    desktopAnimation: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isRendered: false,

      x: 180,
      y: 0,

      windowWidth: 958,
      windowHeight: 542,

      count: 0,

      mouseEnabled: true,
      sceneVisible: true,

      useFallback: false,

      debug: false
    }
  },

  computed: {
    ...mapState(['isConnected', 'isSkipped', 'introPlayed']),

    ratio() {
      return this.windowWidth / this.windowHeight
    }
  },

  watch: {
    x(x) {
      this.updateRotation(x, this.y)
    },

    y(y) {
      this.updateRotation(this.x, y)
    }
  },

  mounted() {
    if (!webglIsSupported()) {
      this.useFallback = true
      this.isRendered = true
      return
    }

    const pairingEl = this.$slots.default[0].elm
    this.updateSizes()

    debouncedResize(() => {
      if (this.isDesktop) {
        this.updateSizes()
      }
    })

    this.animation = new ThreeAnimation(
      this.$refs.container,
      ANIMATION_SCREEN_VIEWPORT,
      this.desktopAnimation,
      this.debug,
      pairingEl
    )

    const screen = this.animation.getScreen()
    const DrawingCtor = this.$root.constructor.extend(Drawing)
    this.instance = new DrawingCtor({
      parent: this,
      propsData: {
        showToolbar: true,
        isDrawing: false
      }
    }).$mount(screen)

    this.animation.setSize(this.windowWidth, this.windowHeight)

    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mousedown', this.onMouseDown)
    window.addEventListener('mouseup', this.onMouseUp)

    window.addEventListener('touchstart', this.onMouseDown)
    window.addEventListener('touchend', this.onMouseUp)
    window.addEventListener('touchcancel', this.onMouseUp)

    if (!this.isDesktop) {
      this.loop()
    }

    if (!this.introPlayed) {
      this.animation.animateEnter()
    } else {
      this.animation.setFinalCameraState()
    }

    this.animation.on('animationEnd', () => {
      this.$vuetamin.trigger(threads.SIZES)
    })

    this.animation.on('slowPerformance', () => {
      this.useFallback = true
      this.isRendered = true
      this.destroy()

      const pairingEl = this.$slots.default[0].elm
      pairingEl.removeAttribute('style')
    })

    this.animation.refresh()
    this.animation.setSize(this.windowWidth, this.windowHeight)

    this.$store.commit('setIntroPlayed', true)

    this.isRendered = true

    this.animation.play()
  },

  destroyed() {
    this.destroy()
  },

  methods: {
    destroy() {
      if (this.instance) {
        this.instance.$destroy()
        this.instance.$el.remove()
        this.instance = null
      }

      if (this.animation) {
        this.animation.dispose()
      }

      window.removeEventListener('mousemove', this.onMouseMove)
      window.removeEventListener('mousedown', this.onMouseDown)
      window.removeEventListener('mouseup', this.onMouseUp)

      window.removeEventListener('touchstart', this.onMouseDown)
      window.removeEventListener('touchend', this.onMouseUp)
      window.removeEventListener('touchcancel', this.onMouseUp)
    },

    loop() {
      const orientation = this.$mote.gyroscope.getOrientation(100)

      this.animation.setPhoneRotationFromGyro(orientation)
      this.getIntersection()

      window.requestAnimationFrame(this.loop)
    },

    onAfterLeave() {
      this.destroy()
    },

    handleRange(e) {
      this.animation.seekAnimation(e.target.value)
    },

    updateRotation(x, y) {
      this.animation.setPhoneRotationFromMouse(x, y)
      this.getIntersection()
    },

    getIntersection() {
      const coordinates = this.animation.getIntersection()
      if (!coordinates) return
      this.$vuetamin.store.mutate('updatePointer', { coordinates })
    },

    onMouseMove(e) {
      if (!this.mouseEnabled) {
        return
      }
      // e.preventDefault()
      this.setOrientation(e.pageX, e.pageY)
    },

    onMouseDown() {
      if (!this.mouseEnabled) {
        return
      }
      // e.preventDefault()
      this.$vuetamin.store.mutate('updateIsPressing', { isPressing: true })
    },

    onMouseUp() {
      if (!this.mouseEnabled) {
        return
      }
      // e.preventDefault()
      this.$vuetamin.store.mutate('updateIsPressing', { isPressing: false })
    },

    setOrientation(x, y) {
      this.x = x / this.windowWidth
      this.y = y / this.windowHeight
    },

    updateSizes() {
      this.windowWidth = window.innerWidth
      this.windowHeight = window.innerHeight
      if (this.animation) {
        this.animation.setSize(this.windowWidth, this.windowHeight)
      }
    }
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

.animation {
  user-select: none;
  &.appear-enter-active,
  &.appear-leave-active {
    transition: 1s;
  }
  &.appear-leave-active {
    transition-delay: 1s;
  }
  &.appear-enter,
  &.appear-leave-to {
    opacity: 0;
  }
}

.three-animation {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 0;

  .is-fallback & {
    background-image: url('/fallback-mobile.jpg');
    background-size: cover;
    background-position: top center;

    @include media('lg') {
      background-image: url('/fallback-desktop.jpg');
      background-position: center;
    }
  }
  .is-desktop & {
    width: 100%;
    height: 100%;
  }
}

.renderer-webgl {
  position: relative;
  top: 0;
  left: 0;
  z-index: 10;
}

.renderer-webgl {
  z-index: 15;
}

.renderer-css {
  &,
  canvas {
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
  }
  > div {
    z-index: 10;
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

.screen-container {
  z-index: 10;
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
