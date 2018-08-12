<template>
  <div class="app-drawing-canvas relative" ref="canvasContainer">
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
    },
    useLazyBrush: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      viewport: {
        width: 0,
        height: 0,
        ratio: 1
      },
      smoothing: SMOOTHING_INIT + 90,
      isDrawing: false,
      pointCount: 0,
      currentPath: [],
      fillStyle: 'gradient',
      canvasRect: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      }
    }
  },

  computed: {
    contextSize () {
      return {
        width: this.canvasRect.width * this.viewport.ratio,
        height: this.canvasRect.height * this.viewport.ratio
      }
    },
    canvasCoordinates () {
      return {
        x: this.coordinates.x - this.canvasRect.left,
        y: this.coordinates.y - this.canvasRect.top
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
    canvasCoordinates: {
      handler (newCoordinates, prevCoordinates) {
        if (this.isDrawing && (newCoordinates.x !== prevCoordinates.x || newCoordinates.y !== prevCoordinates.y)) {
          let coordinates = newCoordinates

          if (this.useLazyBrush) {
            const distance = lineDistance(prevCoordinates.x, prevCoordinates.y, newCoordinates.x, newCoordinates.y)

            // now, here we scale the initial smoothing factor by the raw distance
            // this means that when the mouse moves fast, there is more smoothing
            // and when we're drawing small detailed stuff, we have more control
            // also we hard clip at 1
            const smoothingFactor = Math.min(1, this.smoothing + (distance - 10) / 7000)

            // calculate smoothed coordinates
            coordinates = {
              x: prevCoordinates.x - (prevCoordinates.x - newCoordinates.x) * smoothingFactor,
              y: prevCoordinates.y - (prevCoordinates.y - newCoordinates.y) * smoothingFactor
            }
          }

          this.currentPath.push(coordinates)

          this.drawStroke()
        }
      },
      deep: true
    },
    isPressing: function (isPressing) {
      if (isPressing) {
        this.currentPath.push(this.canvasCoordinates)
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

    setCanvasRect () {
      const rect = this.$refs.canvasContainer.getBoundingClientRect()

      this.canvasRect.width = rect.width
      this.canvasRect.height = rect.height
      this.canvasRect.top = rect.top
      this.canvasRect.left = rect.left
    },

    setupCanvases () {
      this.setCanvasRect()

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
      const blur = ((1 - hardness) * radius) * this.viewport.ratio

      this.contextTemp.lineWidth = (hardness + 1) * radius
      this.contextTemp.filter = `blur(${blur}px)`
    },

    setCanvasColor (color) {
      this.contextTemp.globalAlpha = this.brush.opacity
      this.contextTemp.strokeStyle = color
      this.contextTemp.fillStyle = color
    },

    clearCanvas (context) {
      context.clearRect(0, 0, this.contextSize.width, this.contextSize.height)
    },

    copyToMainCanvas () {
      this.contextMain.drawImage(this.$refs.canvas_temp, 0, 0, this.canvasRect.width, this.canvasRect.height)
      this.clearCanvas(this.contextTemp)
    },

    drawStroke () {
      let midPoint = {}
      let prevCoord = this.currentPath[0]
      let currentCoord = this.currentPath[1]

      this.clearCanvas(this.contextTemp)
      this.contextTemp.beginPath()

      this.contextTemp.moveTo(prevCoord.x, prevCoord.y)

      for (var i = 1; i < this.currentPath.length; i++) {
        midPoint = midPointBetween(prevCoord, currentCoord)
        this.contextTemp.quadraticCurveTo(prevCoord.x, prevCoord.y, midPoint.x, midPoint.y)
        prevCoord = this.currentPath[i]
        currentCoord = this.currentPath[i + 1]
      }

      this.contextTemp.lineTo(prevCoord.x, prevCoord.y)
      this.contextTemp.stroke()
    }
  },

  created () {
    this.contextTemp = {}
    this.contextMain = {}
  },

  mounted () {
    this.contextTemp = this.getContext('temp')
    this.contextMain = this.getContext('main')

    // Add event listeners
    EventBus.$on('clearCanvas', () => {
      this.clearCanvas(this.contextMain)
    })

    this.viewport = getViewportSize()

    this.setupCanvases()
    this.updateBrush(BRUSH_DEFAULT)
  }
}
</script>

<style lang="scss" scoped>
.app-drawing-canvas {
  background: white;
  height: 100%;
}

.canvas--main {
  z-index: $index-canvas-main;
}

.canvas--temp {
  z-index: $index-canvas-temp;
}
</style>
