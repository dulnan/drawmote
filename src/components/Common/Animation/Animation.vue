<template>
  <div ref="container">
    <!-- <drawing /> -->
  </div>
</template>

<script>
import { GyroPlane } from 'gyro-plane'
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

      gyro: new GyroPlane({
        width: ANIMATION_SCREEN_VIEWPORT.width,
        height: ANIMATION_SCREEN_VIEWPORT.height,
        distance: 1000
      }),

      count: 0,

      mouseEnabled: true,
      sceneVisible: true
    }
  },

  computed: {
    ...mapState(['isConnected']),

    brush () {
      this.gyro.updateOrientation({ alpha: this.alpha, beta: this.beta })

      // To get the calculated coordinates, you have to call this function.
      return this.gyro.getScreenCoordinates()
    }
  },

  watch: {
    brush (coordinates) {
      if (coordinates) {
        this.$vuetamin.store.mutate('updatePointer', {
          coordinates: {
            x: coordinates.x, y: coordinates.y
          }
        })
      }
    },

    alpha (alpha) {
      this.animation.setPhoneRotation(alpha, this.beta)
    },

    beta (beta) {
      this.animation.setPhoneRotation(this.alpha, beta)
    }
  },

  methods: {
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
      this.alpha = (27) * -(x - (this.windowWidth / 2)) / (this.windowWidth / 2)
      this.beta = (17) * -(y - (this.windowHeight / 2)) / (this.windowHeight / 2)
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
    })

    this.gyro.updateOffset({ alpha: this.alpha, beta: this.beta })
    this.animation = new ThreeAnimation(this.$refs.container, ANIMATION_SCREEN_VIEWPORT)
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
}

.dg.ac {
  z-index: 999999;
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
</style>
