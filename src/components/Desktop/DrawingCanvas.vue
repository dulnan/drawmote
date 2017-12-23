<template>
  <div class="app-drawing-canvas relative overlay">
    <canvas class="absolute overlay canvas canvas--main" ref="canvas_main"></canvas>
    <canvas class="absolute overlay canvas canvas--temp" ref="canvas_temp"></canvas>
  </div>
</template>

<script>
import { EventBus } from '@/events'

import { SMOOTHING_INIT, BRUSH_DEFAULT } from '@/settings'
import { getViewportSize, lineDistance, getRgbaString, midPointBetween } from '@/tools/helpers.js'

export default {
  name: 'DrawingCanvas',

  props: {
    brush: {
      type: Object,
      default: () => {
        return {}
      }
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
      pointCount: 0,
      currentPath: [],
      fillStyle: 'gradient'
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
    brush: {
      handler (brush) {
        this.updateBrush(brush)
      },
      deep: true
    },
    coordinates: {
      handler (newCoordinates, prevCoordinates) {
        if (this.isDrawing && (newCoordinates.x !== prevCoordinates.x && newCoordinates.y !== prevCoordinates.y)) {
          const distance = lineDistance(prevCoordinates.x, prevCoordinates.y, newCoordinates.x, newCoordinates.y)

          // now, here we scale the initial smoothing factor by the raw distance
          // this means that when the mouse moves fast, there is more smoothing
          // and when we're drawing small detailed stuff, we have more control
          // also we hard clip at 1
          const smoothingFactor = Math.min(0.87, this.smoothing + (distance - 60) / 3000)

          // calculate smoothed coordinates
          const smoothedCoordinates = {
            x: prevCoordinates.x - (prevCoordinates.x - newCoordinates.x) * smoothingFactor,
            y: prevCoordinates.y - (prevCoordinates.y - newCoordinates.y) * smoothingFactor
          }
          this.currentPath.push(smoothedCoordinates)
          this.draw()
        }
      },
      deep: true
    },
    isPressing: function (isPressing) {
      if (isPressing) {
        this.currentPath.push(this.coordinates)
        this.isDrawing = true
      } else {
        this.copyToMainCanvas()
        this.currentPath = []
        this.isDrawing = false
      }
    }
  },

  methods: {
    getContext (name) {
      return this.$refs['canvas_' + name].getContext('2d')
    },

    updateBrush (brush) {
      const brushColor = getRgbaString(brush.color.rgb, 1)
      this.setCanvasColor(brushColor)
      this.setCanvasLineWidth(brush.radius, brush.hardness)
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
    },

    setCanvasLineWidth (radius, hardness) {
      let contextTemp = this.getContext('temp')
      const blur = ((1 - hardness) * radius)

      contextTemp.lineWidth = (hardness + 1) * radius
      contextTemp.filter = `blur(${blur}px)`
    },

    setCanvasColor (color) {
      let contextTemp = this.getContext('temp')

      contextTemp.globalAlpha = this.brush.opacity
      contextTemp.strokeStyle = color
      contextTemp.fillStyle = color
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

    draw () {
      let context = this.getContext('temp')
      let midPoint = {}
      let prevCoord = this.currentPath[0]
      let currentCoord = this.currentPath[1]

      this.clearCanvas(context)
      context.beginPath()

      context.moveTo(prevCoord.x, prevCoord.y)

      for (var i = 1; i < this.currentPath.length; i++) {
        midPoint = midPointBetween(prevCoord, currentCoord)
        context.quadraticCurveTo(prevCoord.x, prevCoord.y, midPoint.x, midPoint.y)
        prevCoord = this.currentPath[i]
        currentCoord = this.currentPath[i + 1]
      }

      context.lineTo(prevCoord.x, prevCoord.y)
      context.stroke()
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
    this.updateBrush(BRUSH_DEFAULT)
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
