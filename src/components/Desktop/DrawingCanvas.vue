<template>
  <div class="app-drawing-canvas relative overlay">
    <canvas class="absolute overlay canvas canvas--main" ref="canvas_main"></canvas>
    <canvas class="absolute overlay canvas canvas--temp" ref="canvas_temp"></canvas>
  </div>
</template>

<script>
import { EventBus } from '@/events'

import { DEFAULT_COLOR, RADIUS_DEFAULT, HARDNESS_DEFAULT, SMOOTHING_INIT } from '@/settings'
import { getViewportSize, lineDistance } from '@/tools/helpers.js'

export default {
  name: 'DrawingCanvas',

  props: {
    color: {
      type: String,
      default: DEFAULT_COLOR.hex
    },
    radius: {
      type: Number,
      default: RADIUS_DEFAULT
    },
    hardness: {
      type: Number,
      default: HARDNESS_DEFAULT
    },
    coordinates: {
      type: Object,
      default: () => {
        return {
          x: 0,
          y: 0
        }
      }
    },
    isPressing: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      viewport: {
        width: 0,
        height: 0,
        ratio: 1
      },
      smoothing: SMOOTHING_INIT,
      isDrawing: false,
      pointCount: 0
    }
  },

  computed: {
    contextSize: function () {
      return {
        width: this.viewport.width * this.viewport.ratio,
        height: this.viewport.height * this.viewport.ratio
      }
    }
  },

  watch: {
    radius: function (radius) {
      this.setCanvasLineWidth(radius)
    },
    color: function (color) {
      this.setCanvasColor(color)
    },
    coordinates: {
      handler (newCoordinates, prevCoordinates) {
        if (this.isDrawing && (newCoordinates.x !== prevCoordinates.x && newCoordinates.y !== prevCoordinates.y)) {
          this.draw(prevCoordinates, newCoordinates)
        }
      },
      deep: true
    },
    isPressing: function (isPressing) {
      let contextTemp = this.getContext('temp')

      if (isPressing) {
        contextTemp.beginPath()
        this.draw(this.coordinates, this.coordinates)
        this.isDrawing = true
      } else {
        contextTemp.closePath()
        this.copyToMainCanvas()
        this.isDrawing = false
      }
    }
  },

  methods: {
    getContext (name) {
      return this.$refs['canvas_' + name].getContext('2d')
    },

    setupCanvases () {
      let canvases = [
        this.$refs.canvas_temp,
        this.$refs.canvas_main
      ]

      canvases.forEach(canvas => {
        let context = canvas.getContext('2d')

        canvas.width = this.contextSize.width
        canvas.height = this.contextSize.height

        context.lineJoin = 'round'
        context.lineCap = 'round'
        context.scale(this.viewport.ratio, this.viewport.ratio)
      })

      this.setCanvasLineWidth(this.radius)
      this.setCanvasColor(this.color)
      this.setCanvasShadow(this.hardness, this.color)
    },

    setCanvasLineWidth (radius) {
      let contextTemp = this.getContext('temp')
      contextTemp.lineWidth = radius * 2
    },

    setCanvasColor (color) {
      let contextTemp = this.getContext('temp')
      contextTemp.strokeStyle = color
      contextTemp.fillStyle = color
    },

    setCanvasShadow (hardness, color) {
      // let contextTemp = this.getContext('temp')
      // contextTemp.shadowBlur = this.radius
      // contextTemp.shadowColor = color
    },

    clearCanvas (context) {
      context.clearRect(0, 0, this.contextSize.width, this.contextSize.height)
    },

    copyToMainCanvas () {
      let contextMain = this.getContext('main')
      let contextTemp = this.getContext('temp')

      contextMain.drawImage(this.$refs.canvas_temp, 0, 0, this.viewport.width, this.viewport.height)
      this.clearCanvas(contextTemp)
    },

    beginPath () {
      let contextTemp = this.getContext('temp')
      contextTemp.beginPath()
    },

    closePath () {
      let contextTemp = this.getContext('temp')
      contextTemp.closePath()
    },

    draw (prevCoordinates, coordinates) {
      let context = this.getContext('temp')

      // calculate distance from previous point
      const distance = lineDistance(prevCoordinates.x, prevCoordinates.y, coordinates.x, coordinates.y)

      // now, here we scale the initial smoothing factor by the raw distance
      // this means that when the mouse moves fast, there is more smoothing
      // and when we're drawing small detailed stuff, we have more control
      // also we hard clip at 1
      const smoothingFactor = Math.min(0.87, this.smoothing + (distance - 60) / 3000)

      // calculate smoothed coordinates
      const smoothedCoordinates = {
        x: prevCoordinates.x - (prevCoordinates.x - coordinates.x) * smoothingFactor,
        y: prevCoordinates.y - (prevCoordinates.y - coordinates.y) * smoothingFactor
      }

      // recalculate distance from previous point, this time relative to the smoothed coords
      // const smoothedDistance = lineDistance(smoothedCoordinates.x, smoothedCoordinates.y, this.coordinates.x, this.coordinates.y)

      // draw using quad interpolation
      context.quadraticCurveTo(prevCoordinates.x, prevCoordinates.y, smoothedCoordinates.x, smoothedCoordinates.y)
      context.stroke()

      this.pointCount++

      if (this.pointCount > 6) {
        this.closePath()
        this.copyToMainCanvas()
        this.pointCount = 0
        this.beginPath()
      }
    }
  },

  mounted () {
    // Add event listeners
    EventBus.$on('clearCanvas', () => {
      const context = this.getContext('main')
      this.clearCanvas(context)
    })

    this.viewport = getViewportSize()

    this.setupCanvases()
  }
}
</script>

<style lang="scss" scoped>
.app-drawing-canvas {
}

.canvas--main {
  z-index: $index-canvas-main;
}

.canvas--temp {
  z-index: $index-canvas-temp;
}
</style>
