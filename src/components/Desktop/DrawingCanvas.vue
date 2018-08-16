<template>
  <div class="app-drawing-canvas relative" ref="canvasContainer">
    <canvas class="absolute overlay canvas canvas--main" ref="canvas_main"></canvas>
    <canvas class="absolute overlay canvas canvas--temp" ref="canvas_temp"></canvas>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { EventBus } from '@/events'

import { SMOOTHING_INIT } from '@/settings'
import { getRgbaString, midPointBetween } from '@/tools/helpers.js'

export default {
  name: 'DrawingCanvas',

  data () {
    return {
      smoothing: SMOOTHING_INIT + 90,
      isDrawing: false,
      fillStyle: 'gradient'
    }
  },

  computed: {
    ...mapState('Brush', [
      'isPressing',
      'color',
      'hardness',
      'opacity',
      'radius',
      'useLazyBrush'
    ]),
    ...mapState('App', [
      'viewport',
      'canvasRect',
      'isHoveringToolbar'
    ]),
    contextSize () {
      return {
        width: this.canvasRect.width * this.viewport.ratio,
        height: this.canvasRect.height * this.viewport.ratio
      }
    }
  },

  watch: {
    opacity: function (opacity) {
      this.setCanvasColor(this.color, opacity)
    },

    color: function (color) {
      this.setCanvasColor(color, this.opacity)
    },

    hardness: function (hardness) {
      this.setCanvasLineWidth(this.radius, hardness)
    },

    radius: function (radius) {
      this.setCanvasLineWidth(radius, this.hardness)
    },

    isPressing: function (isPressing) {
      if (isPressing && !this.isHoveringToolbar) {
        this.currentPath.push(this.$global.canvasCoordinates)
        this.isDrawing = true
      } else {
        this.copyToMainCanvas()

        this.currentPath = []
        this.isDrawing = false
      }
    }
  },

  methods: {
    loop: function () {
      if (this.isDrawing) {
        const newCoordinates = this.$global.canvasCoordinates
        const prevCoordinates = this.$global.prevCanvasCoordinates

        if (this.isDrawing && (newCoordinates.x !== prevCoordinates.x || newCoordinates.y !== prevCoordinates.y)) {
          this.currentPath.push(newCoordinates)

          this.drawStroke()
        }
      }
      window.requestAnimationFrame(this.loop)
    },

    getContext (name) {
      return this.$refs['canvas_' + name].getContext('2d')
    },

    setupCanvases () {
      let canvases = ['temp', 'main']

      canvases.forEach(id => {
        let canvas = this.$refs['canvas_' + id]
        let context = this.$refs['canvas_' + id].getContext('2d')

        canvas.width = this.contextSize.width
        canvas.height = this.contextSize.height

        context.lineJoin = 'round'
        context.lineCap = 'round'
        context.scale(this.viewport.ratio, this.viewport.ratio)
      })

      this.setCanvasColor(this.color, this.opacity)
      this.setCanvasLineWidth(this.radius, this.hardness)
    },

    setCanvasLineWidth (radius, hardness) {
      const context = this.getContext('temp')

      const blur = ((1 - (hardness / 100)) * radius) * this.viewport.ratio

      context.lineWidth = ((hardness / 100) + 1) * radius
      context.filter = `blur(${blur}px)`
    },

    setCanvasColor (color, opacity) {
      const context = this.getContext('temp')

      const rgba = getRgbaString(color.rgb, opacity / 100)

      context.globalAlpha = 1
      context.strokeStyle = rgba
      context.fillStyle = rgba
    },

    clearCanvas (context) {
      context.clearRect(0, 0, this.contextSize.width, this.contextSize.height)
    },

    copyToMainCanvas () {
      const contextTemp = this.getContext('temp')
      const contextMain = this.getContext('main')

      contextMain.drawImage(this.$refs.canvas_temp, 0, 0, this.canvasRect.width, this.canvasRect.height)
      this.clearCanvas(contextTemp)
    },

    drawStroke () {
      const contextTemp = this.getContext('temp')

      let midPoint = {}
      let prevCoord = this.currentPath[0]
      let currentCoord = this.currentPath[1]

      this.clearCanvas(contextTemp)
      contextTemp.beginPath()

      contextTemp.moveTo(prevCoord.x, prevCoord.y)

      for (var i = 1; i < this.currentPath.length; i++) {
        midPoint = midPointBetween(prevCoord, currentCoord)
        contextTemp.quadraticCurveTo(prevCoord.x, prevCoord.y, midPoint.x, midPoint.y)
        prevCoord = this.currentPath[i]
        currentCoord = this.currentPath[i + 1]
      }

      contextTemp.lineTo(prevCoord.x, prevCoord.y)
      contextTemp.stroke()
    },

    eraseCanvas () {
      const context = this.getContext('main')
      this.clearCanvas(context)
    }
  },

  created () {
    this.currentPath = []
  },

  mounted () {
    // Add event listeners
    EventBus.$on('clearCanvas', this.eraseCanvas)

    this.$nextTick(() => {
      this.setupCanvases()
      this.loop()
    })
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
