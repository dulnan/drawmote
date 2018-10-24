<template>
  <div>
    <canvas class="fixed overlay canvas canvas--main" ref="canvas_main"></canvas>
    <canvas class="fixed overlay canvas canvas--temp" ref="canvas_temp"></canvas>
  </div>
</template>

<script>
import Canvas from '@/mixins/Canvas'

import { EventBus } from '@/events'

import CanvasState from '@/classes/CanvasState.js'
import { isSamePoint } from '@/tools/helpers.js'
import { threads } from '@/store'

export default {
  name: 'CanvasDrawing',

  mixins: [
    Canvas
  ],

  loop: {
    handleSizes: [threads.SIZES],
    handlePoint: [threads.POINT]
  },

  data () {
    return {
      wasPressingBefore: false,
      previousPoint: {}
    }
  },

  methods: {
    handleSizes (state) {
      this.setCanvasSizes()
      this.canvasState.updateSizes(state.sizes.viewport)
    },

    handlePoint (state) {
      if (!state.isPressing && this.wasPressingBefore) {
        this.canvasState.release()
        this.wasPressingBefore = false
        this.updateCanvasState()
      }

      if (state.isPressing && !isSamePoint(state.points.brush, this.previousPoint) && !state.pointingAtToolbar) {
        if (!this.wasPressingBefore) {
          this.canvasState.start(state.brush.canvasProperties)
          this.wasPressingBefore = true
        }

        this.canvasState.move(state.points.brush)
      }

      this.previousPoint = state.points.brush
    },

    handleErase () {
      this.canvasState.erase()
      this.updateCanvasState()
    },

    handleUndo () {
      this.canvasState.undo()
      this.updateCanvasState()
    },

    handleRedo () {
      this.canvasState.redo()
      this.updateCanvasState()
    },

    updateCanvasState () {
      const state = this.canvasState.state
      EventBus.$emit('canvasState', state)
    },

    setCanvasSizes () {
      this.setupCanvases(this.$loop.getState().sizes.viewport, [
        this.$refs.canvas_main,
        this.$refs.canvas_temp
      ])
    }
  },

  beforeDestroy () {
    EventBus.$off('clearCanvas', this.handleErase)
    EventBus.$off('undoCanvas', this.handleUndo)
    EventBus.$off('redoCanvas', this.handleRedo)
  },

  mounted () {
    this.wasPressingBefore = false
    this.setCanvasSizes()

    const canvasMain = this.$refs['canvas_main']
    const canvasTemp = this.$refs['canvas_temp']

    this.canvasState = new CanvasState(canvasMain, canvasTemp)

    EventBus.$on('clearCanvas', this.handleErase)
    EventBus.$on('undoCanvas', this.handleUndo)
    EventBus.$on('redoCanvas', this.handleRedo)
  }
}
</script>

<style lang="scss">
.app-drawing-canvas {
  background: white;
  height: 100%;
  width: 100%;
}

.canvas--main {
  z-index: $index-canvas-main;
}

.canvas--temp {
  z-index: $index-canvas-temp;
}
</style>
