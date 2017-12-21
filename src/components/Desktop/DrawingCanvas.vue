<template>
  <div class="app-drawing-canvas relative overlay">
    <canvas class="absolute overlay canvas canvas--main" ref="canvas_main"></canvas>
    <canvas class="absolute overlay canvas canvas--temp" ref="canvas_temp"></canvas>
  </div>
</template>

<script>
import { EventBus } from '@/events'

import { DEFAULT_COLOR, RADIUS_DEFAULT } from '@/settings'
import { getViewportSize } from '@/tools/helpers.js'

let points = []

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
      }
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
    isPressing: function (isPressing) {
      if (isPressing) {
        this.draw()
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

    clearCanvas (context) {
      context.clearRect(0, 0, this.contextSize.width, this.contextSize.height)
    },

    draw () {
      points.push({
        x: this.coordinates.x,
        y: this.coordinates.y
      })

      if (this.isPressing) {
        window.requestAnimationFrame(this.draw)
        let contextTemp = this.getContext('temp')

        if (points.length < 6) {
          const b = points[0]
          contextTemp.beginPath()
          contextTemp.arc(b.x, b.y, contextTemp.lineWidth / 2, 0, Math.PI * 2, !0)
          contextTemp.fill()
          contextTemp.closePath()

          return
        }

        this.clearCanvas(contextTemp)

        contextTemp.beginPath()
        contextTemp.moveTo(points[0].x, points[0].y)

        for (var i = 1; i < points.length - 2; i++) {
          var c = (points[i].x + points[i + 1].x) / 2
          var d = (points[i].y + points[i + 1].y) / 2
          contextTemp.quadraticCurveTo(points[i].x, points[i].y, c, d)
        }

        // For the last 2 points
        contextTemp.quadraticCurveTo(
          points[i].x,
          points[i].y,
          points[i + 1].x,
          points[i + 1].y
        )

        contextTemp.stroke()
      } else {
        this.copyToMainCanvas()
      }
    },

    copyToMainCanvas () {
      let contextMain = this.getContext('main')
      let contextTemp = this.getContext('temp')

      contextMain.drawImage(this.$refs.canvas_temp, 0, 0, this.viewport.width, this.viewport.height)
      this.clearCanvas(contextTemp)
      points = []
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
