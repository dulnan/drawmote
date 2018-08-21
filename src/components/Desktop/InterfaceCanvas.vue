<template>
  <canvas class="fixed overlay canvas canvas--interface" ref="canvas_interface"></canvas>
</template>

<script>
import Canvas from './Canvas'

import { THREAD_BRUSH, THREAD_POINT } from '@/settings/drawthreads'

export default {
  extends: Canvas,

  name: 'InterfaceCanvas',

  draw: [
    {
      threads: [THREAD_BRUSH, THREAD_POINT],
      handler: function (state) {
        const context = this.$refs.canvas_interface.getContext('2d')

        this.clear(context, state.sizes.viewport)

        // Draw brush point
        context.beginPath()
        context.fillStyle = state.brush.color.getRgbaString(state.brush.opacity)
        context.arc(state.points.brush.x, state.points.brush.y, state.brush.radius, 0, Math.PI * 2, true)
        context.fill()

        // Draw lazy circle
        context.beginPath()
        context.lineWidth = 1
        context.strokeStyle = '#cccccc'
        context.arc(state.points.brush.x, state.points.brush.y, state.lazyRadius, 0, Math.PI * 2, true)
        context.stroke()

        // Draw catharina
        context.beginPath()
        context.lineWidth = 2
        context.lineCap = 'round'
        context.strokeStyle = '#cccccc'
        // this.catenary.calculateCatenary()
        context.stroke()

        this.clearOutside(context, state.sizes.canvasRect, state.sizes.viewport)

        // Draw mouse point
        context.beginPath()
        context.fillStyle = '#222222'
        context.arc(state.points.mouse.x, state.points.mouse.y, 2, 0, Math.PI * 2, true)
        context.fill()
      }
    }
  ],

  mounted () {
    this.setupCanvases(this.$global.state.sizes.viewport)
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
