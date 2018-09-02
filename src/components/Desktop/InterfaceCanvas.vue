<template>
  <canvas class="fixed overlay canvas canvas--interface" ref="canvas_interface"></canvas>
</template>

<script>
import Canvas from './Canvas'
import { Catenary } from 'catenary-curve'

import { THREAD_BRUSH, THREAD_POINT, THREAD_SLIDE } from '@/settings/drawthreads'

export default {
  extends: Canvas,

  name: 'InterfaceCanvas',

  draw: [
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
        context.filter = `blur(${state.brush.canvasBlur}px)`
        context.arc(state.points.brush.x, state.points.brush.y, state.brush.canvasRadius, 0, Math.PI * 2, true)
        context.fill()
        context.filter = 'none'

        // Draw catharina
        context.beginPath()
        context.lineWidth = 1
        context.lineCap = 'round'
        context.strokeStyle = 'rgba(30,30,30,0.8)'
        context.setLineDash([2, 4])
        this.catenary.drawToCanvas(context, state.points.pointer, state.points.brush, state.lazyRadius)
        context.stroke()

        // Draw brush anchor
        context.beginPath()
        context.fillStyle = 'rgba(50,50,50,1)'
        context.arc(state.points.brush.x, state.points.brush.y, 2, 0, Math.PI * 2, true)
        context.fill()

        // Restore the saved context.
        context.restore()

        // Draw mouse point
        context.beginPath()
        context.fillStyle = 'rgba(50,50,50,0.2)'
        context.arc(state.points.pointer.x, state.points.pointer.y, 4, 0, Math.PI * 2, true)
        context.fill()

        context.beginPath()
        context.strokeStyle = 'rgba(20,20,20,1)'
        context.moveTo(state.points.pointer.x - 10, state.points.pointer.y)
        context.lineTo(state.points.pointer.x + 10, state.points.pointer.y)
        context.moveTo(state.points.pointer.x, state.points.pointer.y - 10)
        context.lineTo(state.points.pointer.x, state.points.pointer.y + 10)
        context.stroke()
      }
    }
  ],

  mounted () {
    this.setupCanvases(this.$global.state.sizes.viewport)
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
