<template>
  <div class="drawing">
    <toolbar ref="toolbar" />
    <div class="drawing-area" ref="canvasContainer" :style="drawingAreaStyle"></div>
    <canvas-drawing />
    <canvas-interface />
  </div>
</template>

<script>
import threads from '@/store/threads'

import Toolbar from '@/components/Desktop/Toolbar/Toolbar.vue'
import CanvasDrawing from '@/components/Desktop/Canvas/CanvasDrawing.vue'
import CanvasInterface from '@/components/Desktop/Canvas/CanvasInterface.vue'

import PointerEvents from '@/mixins/PointerEvents.js'

export default {
  name: 'Drawing',

  mixins: [
    PointerEvents
  ],

  components: {
    Toolbar,
    CanvasDrawing,
    CanvasInterface
  },

  data () {
    return {
      toolbarHeight: 0
    }
  },

  computed: {
    drawingAreaStyle () {
      return {
        top: `${this.toolbarHeight}px`
      }
    }
  },

  vuetamin: {
    getElementSizes: [threads.SIZES]
  },

  methods: {
    getElementSizes () {
      if (this.$refs.canvasContainer) {
        const canvasRect = this.$refs.canvasContainer.getBoundingClientRect()
        this.$vuetamin.store.mutate('updateCanvasRect', canvasRect)
      }

      if (this.$refs.toolbar) {
        const toolbarRect = this.$refs.toolbar.$el.getBoundingClientRect()
        this.$vuetamin.store.mutate('updateToolbarRect', toolbarRect)
        this.toolbarHeight = toolbarRect.height
      }
    },

    handlePointerMove (coordinates) {
      this.$vuetamin.store.mutate('updatePointer', { coordinates })
    },

    handlePointerDown () {
      this.$vuetamin.store.mutate('updateIsPressing', { isPressing: true })
    },

    handlePointerUp () {
      this.$vuetamin.store.mutate('updateIsPressing', { isPressing: false })
    },

    handleTouch (touch) {
      this.$vuetamin.store.mutate('updateTouch', touch)
    },

    handleCalibrated () {
      this.$vuetamin.store.mutate('updateCalibration')
    }
  },

  mounted () {
    this.getElementSizes()

    this.$mote.on('pointermove', this.handlePointerMove)
    this.$mote.on('pointerdown', this.handlePointerDown)
    this.$mote.on('pointerup', this.handlePointerUp)
    this.$mote.on('touch', this.handleTouch)
    this.$mote.on('calibrated', this.handleCalibrated)
  },

  beforeDestroy () {
    this.$mote.off('pointermove', this.handlePointerMove)
    this.$mote.off('pointerdown', this.handlePointerDown)
    this.$mote.off('pointerup', this.handlePointerUp)
    this.$mote.off('touch', this.handleTouch)
    this.$mote.off('calibrated', this.handleCalibrated)
  }
}
</script>

<style lang="scss">
.drawing {
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  &.appear-enter-active, &.appear-leave-active {
    transition: 1s;
  }
  &.appear-enter, &.appear-leave-to {
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
