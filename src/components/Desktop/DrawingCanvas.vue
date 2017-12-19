<template>
  <div class="app-drawing-canvas relative overlay">
    <canvas class="absolute overlay canvas canvas--main" ref="canvas_main"></canvas>
    <canvas class="absolute overlay canvas canvas--temp" ref="canvas_temp"></canvas>
  </div>
</template>

<script>
import { DEFAULT_COLOR, DEFAULT_RADIUS } from '@/settings'

export default {
  name: 'DrawingCanvas',

  props: {
    viewport: {
      type: Object,
      default: () => {
        return {
          width: 0,
          height: 0,
          ratio: 1
        }
      }
    },
    color: {
      type: String,
      default: DEFAULT_COLOR.hex
    },
    radius: {
      type: Number,
      default: DEFAULT_RADIUS
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
      contextMain: {},
      contextTemp: {}
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

  /**
   * Add non-reactive data objects.
   */
  created () {
    this.points = []
  },

  watch: {
    radius: function (radius) {
      this.setCanvasLineWidth(this.contextTemp, radius)
    },
    color: function (color) {
      this.setCanvasColor(this.contextTemp, color)
    },
    isPressing: function (isPressing) {
      if (isPressing) {
        this.draw()
      }
    }
  },

  methods: {
    setupCanvases () {
      const ratio = this.viewport.ratio

      this.$refs.canvas_temp.width = this.contextSize.width
      this.$refs.canvas_temp.height = this.contextSize.height

      this.$refs.canvas_main.width = this.contextSize.width
      this.$refs.canvas_main.height = this.contextSize.height

      this.contextTemp.lineJoin = 'round'
      this.contextTemp.lineCap = 'round'

      this.contextTemp.scale(ratio, ratio)
      this.contextMain.scale(ratio, ratio)
    },

    setCanvasLineWidth (context, radius) {
      context.lineWidth = radius * 2
    },

    setCanvasColor (context, color) {
      context.strokeStyle = color
      context.fillStyle = color
    },

    clearCanvas (context) {
      context.clearRect(0, 0, this.contextSize.width, this.contextSize.height)
    },

    draw () {
      this.points.push({
        x: this.coordinates.x,
        y: this.coordinates.y
      })

      if (this.isPressing) {
        window.requestAnimationFrame(this.draw)

        if (this.points.length < 3) {
          var b = this.points[0]
          this.contextTemp.beginPath()
          this.contextTemp.arc(b.x, b.y, this.contextTemp.lineWidth / 2, 0, Math.PI * 2, !0)
          this.contextTemp.fill()
          this.contextTemp.closePath()

          return
        }

        this.clearCanvas(this.contextTemp)

        this.contextTemp.beginPath()
        this.contextTemp.moveTo(this.points[0].x, this.points[0].y)

        for (var i = 1; i < this.points.length - 2; i++) {
          var c = (this.points[i].x + this.points[i + 1].x) / 2
          var d = (this.points[i].y + this.points[i + 1].y) / 2
          this.contextTemp.quadraticCurveTo(this.points[i].x, this.points[i].y, c, d)
        }

        // For the last 2 points
        this.contextTemp.quadraticCurveTo(
          this.points[i].x,
          this.points[i].y,
          this.points[i + 1].x,
          this.points[i + 1].y
        )

        this.contextTemp.stroke()
      } else {
        this.copyToMainCanvas()
      }
    },

    copyToMainCanvas () {
      this.contextMain.drawImage(this.$refs.canvas_temp, 0, 0, this.viewport.width, this.viewport.height)
      this.clearCanvas(this.contextTemp)
      this.points = []
    }
  },

  mounted () {
    this.contextTemp = this.$refs.canvas_temp.getContext('2d')
    this.contextMain = this.$refs.canvas_main.getContext('2d')

    this.setupCanvases()
    this.setCanvasLineWidth(this.contextTemp, this.radius)
    this.setCanvasColor(this.contextTemp, this.color)
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
