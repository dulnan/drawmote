<template>
  <canvas class="fixed overlay canvas canvas--interface" ref="canvas_interface"></canvas>
</template>

<script>
/**
 * Draws the moving interface parts of the app on a 2D canvas.
 */
import Canvas from '@/mixins/Canvas'
import { Catenary } from 'catenary-curve'

import { THREAD_BRUSH, THREAD_POINT, THREAD_SLIDE, THREAD_SIZES } from '@/settings/drawthreads'
import { RADIUS_MAX } from '@/settings'

const BRUSH_PREVIEW_PADDING = 30

export default {
  name: 'CanvasInterface',

  mixins: [
    Canvas
  ],

  draw: [
    {
      threads: [THREAD_SIZES],
      handler: function (state) {
        this.setCanvasSizes()
      }
    },
    {
      threads: [THREAD_BRUSH, THREAD_POINT, THREAD_SLIDE],
      handler: function (state) {
        const context = this.$refs.canvas_interface.getContext('2d')

        this.clear(context, state.sizes.viewport)

        // Save current context before clipping.
        context.save()

        // Clip region outside actual drawing area
        this.clearOutside(context, state.sizes.canvasRect)

        // Draw brush point
        context.beginPath()
        context.fillStyle = state.brush.canvasColor
        if (state.brush.useFilter) {
          context.filter = `blur(${state.brush.canvasBlur}px)`
        }
        context.arc(state.points.brush.x, state.points.brush.y, state.brush.canvasRadius, 0, Math.PI * 2, true)
        context.fill()

        if (state.brush.useFilter) {
          context.filter = 'none'
        }

        /**
         * Draw the catenary.
         */
        context.beginPath()
        context.lineWidth = 1
        context.lineCap = 'round'
        context.strokeStyle = 'rgba(30,30,30,0.8)'
        context.setLineDash([2, 4])
        this.catenary.drawToCanvas(context, state.points.pointer, state.points.brush, state.lazyRadius)
        context.stroke()

        /**
         * Brush anchor
         */
        context.beginPath()
        context.fillStyle = 'rgba(50,50,50,1)'
        context.arc(state.points.brush.x, state.points.brush.y, 2, 0, Math.PI * 2, true)
        context.fill()

        /**
         * Brush preview
         */
        if (state.pointingAtToolbar) {
          const backgroundRadius = (RADIUS_MAX * 2) + (2 * BRUSH_PREVIEW_PADDING)
          const brushX = state.points.brush.x
          const brushY = state.sizes.toolbarRect.height + backgroundRadius + 24

          context.beginPath()
          context.fillStyle = 'white'
          context.strokeStyle = '#dedede'
          context.lineWidth = 1
          context.setLineDash([])
          context.arc(brushX, brushY, backgroundRadius, 0, Math.PI * 2, true)
          context.fill()
          context.stroke()

          context.beginPath()
          context.fillStyle = state.brush.canvasColor

          if (state.brush.useFilter) {
            context.filter = `blur(${state.brush.canvasBlur}px)`
          }

          context.arc(brushX, brushY, state.brush.canvasRadius, 0, Math.PI * 2, true)
          context.fill()
        }

        // Restore the saved context.
        context.restore()

        /**
         * Pointer cross and dot.
         */
        context.beginPath()
        context.fillStyle = 'rgba(50,50,50,0.2)'
        context.arc(state.points.pointer.x, state.points.pointer.y, 4, 0, Math.PI * 2, true)
        context.fill()

        context.beginPath()
        context.strokeStyle = 'rgba(20,20,20,1)'
        context.lineWidth = 1
        context.moveTo(state.points.pointer.x - 10, state.points.pointer.y)
        context.lineTo(state.points.pointer.x + 10, state.points.pointer.y)
        context.moveTo(state.points.pointer.x, state.points.pointer.y - 10)
        context.lineTo(state.points.pointer.x, state.points.pointer.y + 10)
        context.stroke()

        /**
         * Out of bounds indicator.
         */
        // Find out the highest possible x and y coordinates before it's out of view.
        const maxX = state.sizes.canvasRect.width
        const maxY = state.sizes.canvasRect.height + state.sizes.toolbarRect.height - state.sizes.footerRect.height
        const maxXHalf = maxX / 2
        const maxYHalf = maxY / 2

        // Calculate the min and max coordinates.
        const pointerDotX = Math.max(Math.min(state.points.pointer.x, maxX), 0)
        const pointerDotY = Math.max(Math.min(state.points.pointer.y, maxY), 0)

        // Calculate how much outside the pointer is from the max and min amount.
        const offsetX = Math.max(Math.max(Math.abs(state.points.pointer.x - maxXHalf) - maxXHalf, 0) - 30, 0) / 7
        const offsetY = Math.max(Math.max(Math.abs(state.points.pointer.y - maxYHalf) - maxYHalf, 0) - 30, 0) / 7

        // The radius increases the more the pointer is outside the view.
        const radius = Math.min(Math.max(offsetX, offsetY), 30)

        // Draw the circle.
        context.beginPath()
        context.lineWidth = 2
        context.strokeStyle = 'rgba(20,20,20,0.2)'
        context.fillStyle = 'rgba(50,50,50,0.1)'
        context.arc(pointerDotX, pointerDotY, radius, 0, Math.PI * 2, true)
        context.fill()
        context.stroke()
      }
    }
  ],

  methods: {
    /**
     * Clears the area outside a rectangle.
     *
     * @param {CanvasRenderingContext2D} context
     * @param {Rectangle} rectangle
     */
    clearOutside (context, rectangle) {
      const x = rectangle.p1.x
      const y = rectangle.p1.y

      const width = rectangle.p2.x - x
      const height = rectangle.p2.y - y

      context.beginPath()
      context.rect(x, y, width, height)
      context.clip()
    },

    /**
     * Call the function to set the width and height of the canvas elements.
     */
    setCanvasSizes () {
      this.setupCanvases(this.$global.state.sizes.viewport, [this.$refs.canvas_interface])
    }
  },

  mounted () {
    this.setCanvasSizes()
  },

  created () {
    this.catenary = new Catenary()
  }
}
</script>

<style lang="scss">
.canvas--interface {
  z-index: $index-canvas-interface;
  top: 0;
  left: 0;
  pointer-events: none;
}
</style>
