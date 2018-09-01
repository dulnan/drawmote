<template>
  <div>
    <canvas class="fixed overlay canvas canvas--main" ref="canvas_main"></canvas>
    <canvas class="fixed overlay canvas canvas--temp" ref="canvas_temp"></canvas>
  </div>
</template>

<script>
import Canvas from './Canvas'

import { EventBus } from '@/events'

import { midPointBetween, isSamePoint } from '@/tools/helpers.js'

import { THREAD_BRUSH, THREAD_POINT } from '@/settings/drawthreads'

export default {
  extends: Canvas,

  name: 'DrawingCanvas',

  draw: [
    {
      threads: [THREAD_BRUSH],
      handler: function (state) {
        this.setStrokeStyle(state.brush)
      }
    },
    {
      threads: [THREAD_POINT],
      handler: function (state) {
        if (!state.isPressing && this.wasPressingBefore) {
          this.copyToCanvas(this.$refs.canvas_temp, this.$refs.canvas_main, state.sizes.viewport)
          this.currentPath = []
        }

        if (state.isPressing && !isSamePoint(state.points.brush, this.previousPoint) && !state.pointingAtToolbar) {
          this.currentPath.push(state.points.brush)

          const context = this.getContext('temp')
          this.clear(context, state.sizes.viewport)

          this.drawStroke(this.currentPath)
          this.clearOutside(context, state.sizes.canvasRect, state.sizes.viewport)
        }

        this.previousPoint = state.points.brush
        this.wasPressingBefore = state.isPressing
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
    setStrokeStyle (brush) {
      const context = this.getContext('temp')

      this.setLineWidth(context, brush)
      this.setColor(context, brush)
    },

    setLineWidth (context, brush) {
      context.lineJoin = 'round'
      context.lineCap = 'round'
      context.lineWidth = brush.canvasRadius * 2
      context.filter = `blur(${brush.canvasBlur}px)`
    },

    setColor (context, brush) {
      context.globalAlpha = 1
      context.strokeStyle = brush.canvasColor
      context.fillStyle = brush.canvasColor
    },

    getContext (name) {
      return this.$refs['canvas_' + name].getContext('2d')
    },

    drawStroke (points) {
      const context = this.getContext('temp')

      let p1 = points[0]
      let p2 = points[1]

      context.beginPath()
      context.moveTo(p1.x, p1.y)

      for (let i = 1; i < points.length; i++) {
        // we pick the point between pi+1 & pi+2 as the
        // end point and p1 as our control point
        const midPoint = midPointBetween(p1, p2)
        context.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y)
        p1 = points[i]
        p2 = points[i + 1]
      }
      // Draw last line as a straight line while
      // we wait for the next point to be able to calculate
      // the bezier control point
      context.lineTo(p1.x, p1.y)
      context.stroke()
    },

    handleClearCanvas () {
      const context = this.getContext('main')
      this.clear(context, this.$global.state.sizes.viewport)
    }
  },

  created () {
    this.currentPath = []
  },

  mounted () {
    EventBus.$on('clearCanvas', () => {
      this.handleClearCanvas()
    })

    this.setupCanvases(this.$global.state.sizes.viewport)
    this.setStrokeStyle(this.$global.brush)
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
