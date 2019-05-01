<template>
  <div class="drawing" :class="{ 'is-drawing': isDrawing }">
    <div class="two-renderer" ref="renderer"></div>
    <resize-observer @notify="getElementSizes"/>
  </div>
</template>

<script>
import Two from 'two.js'

import threads from '@/store/vuetamin/threads'

import Toolbar from '@/components/Desktop/Toolbar/Toolbar.vue'
import CanvasDrawing from '@/components/Desktop/Canvas/CanvasDrawing.vue'
import CanvasInterface from '@/components/Desktop/Canvas/CanvasInterface.vue'

import PointerEvents from '@/mixins/PointerEvents.js'

export default {
  name: 'Drawing',

  components: {},

  mixins: [PointerEvents],

  props: {
    showToolbar: {
      type: Boolean,
      default: true
    },
    isDrawing: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      toolbarHeight: 0
    }
  },

  computed: {
    drawingAreaStyle() {
      return {
        top: `${this.toolbarHeight}px`
      }
    }
  },

  vuetamin: {
    getElementSizes: [threads.SIZES]
  },

  mounted() {
    this.getElementSizes()

    this.initTwo()

    if (this.$mote.on) {
      this.$mote.on('pointermove', this.handlePointerMove)
      this.$mote.on('pointerdown', this.handlePointerDown)
      this.$mote.on('pointerup', this.handlePointerUp)
      this.$mote.on('touch', this.handleTouch)
      this.$mote.on('calibrated', this.handleCalibrated)
    }
  },

  beforeDestroy() {
    if (this.$mote.on) {
      this.$mote.off('pointermove', this.handlePointerMove)
      this.$mote.off('pointerdown', this.handlePointerDown)
      this.$mote.off('pointerup', this.handlePointerUp)
      this.$mote.off('touch', this.handleTouch)
      this.$mote.off('calibrated', this.handleCalibrated)
    }
  },

  methods: {
    initTwo() {
      // Make an instance of two and place it on the page.
      var elem = this.$refs.renderer
      var params = { width: window.innerWidth, height: window.innerHeight }
      var two = new Two(params).appendTo(elem)

      // two has convenience methods to create shapes.
      var circle = two.makeCircle(72, 100, 50)
      var rect = two.makeRectangle(213, 100, 100, 100)

      // The object returned has many stylable properties:
      circle.fill = '#FF8000'
      circle.stroke = 'orangered' // Accepts all valid css color
      circle.linewidth = 5

      rect.fill = 'rgb(0, 200, 255)'
      rect.opacity = 0.75
      rect.noStroke()

      // Don't forget to tell two to render everything
      // to the screen
      two.update()
    },

    getElementSizes() {
      if (this.$refs.renderer) {
        const canvasContainer = this.$refs.renderer
        this.$vuetamin.store.mutate('updateCanvasRect', canvasContainer)
      }

      // if (this.$refs.toolbar) {
      //   const toolbar = this.$refs.toolbar.$el
      //   this.$vuetamin.store.mutate('updateToolbarRect', toolbar)
      //   this.toolbarHeight = toolbar.offsetHeight
      // }
    },

    handlePointerMove(coordinates) {
      this.$vuetamin.store.mutate('updatePointer', { coordinates })
    },

    handlePointerDown() {
      this.$vuetamin.store.mutate('updateIsPressing', { isPressing: true })
    },

    handlePointerUp() {
      this.$vuetamin.store.mutate('updateIsPressing', { isPressing: false })
    },

    handleTouch(touch) {
      this.$vuetamin.store.mutate('updateTouch', touch)
    },

    handleCalibrated() {
      this.$vuetamin.store.mutate('updateCalibration')
    }
  }
}
</script>

<style lang="scss">
.drawing {
  overflow: hidden;
  position: absolute;
  user-select: none;
  z-index: $index-drawing;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: $alt-color-darker;
  &.appear-enter-active,
  &.appear-leave-active {
    transition: 0.5s;
  }
  &.appear-enter-active {
    transition-delay: 0s;
  }
  &.appear-enter,
  &.appear-leave-to {
    opacity: 0;
  }
}

.drawing-area {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
