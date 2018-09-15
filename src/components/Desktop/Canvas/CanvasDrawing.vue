<template>
  <div>
    <canvas class="fixed overlay canvas canvas--main" ref="canvas_main"></canvas>
    <canvas class="fixed overlay canvas canvas--temp" ref="canvas_temp"></canvas>
  </div>
</template>

<script>
import Canvas from './Canvas'

import { EventBus } from '@/events'

import CanvasState from '@/classes/CanvasState.js'
import { isSamePoint } from '@/tools/helpers.js'
import { THREAD_POINT, THREAD_SIZES } from '@/settings/drawthreads'

export default {
  extends: Canvas,

  name: 'CanvasDrawing',

  draw: [
    {
      threads: [THREAD_SIZES],
      handler: function (state) {
        this.setupCanvases(state.sizes.viewport)
        this.canvasState.updateSizes(state.sizes.viewport)
      }
    },
    {
      threads: [THREAD_POINT],
      handler: function (state) {
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
      }
    }
  ],

  data () {
    return {
      wasPressingBefore: false,
      previousPoint: {}
    }
  },

  methods: {
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
    }
  },

  beforeDestroy () {
    EventBus.$off('clearCanvas', this.handleErase)
    EventBus.$off('undoCanvas', this.handleUndo)
    EventBus.$off('redoCanvas', this.handleRedo)
  },

  mounted () {
    this.wasPressingBefore = false
    this.setupCanvases(this.$global.state.sizes.viewport)

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
