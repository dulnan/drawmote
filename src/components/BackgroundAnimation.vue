<template>
  <div class="fixed overlay background-animation">
    <canvas ref="canvas" />
  </div>
</template>

<script>
import { scaleBetween } from '@/tools/helpers'

let count = 0

let then = Date.now()

export default {
  name: 'BackgroundAnimation',

  props: {
    center: {
      type: Object,
      default: () => {
        return {
          x: 0,
          y: 0
        }
      }
    }
  },

  data () {
    return {
      w: 0,
      h: 0
    }
  },

  computed: {
    circlesNeeded () {
      const max = Math.max(this.w, this.h)
      return Math.ceil(max / this.circleDistance)
    },

    circleDistance () {
      return this.w >= 640 ? 65 : 25
    },

    speed () {
      return this.w >= 640 ? 9 : 5
    }
  },

  watch: {
    center: function () {
      this.setSizes()
    }
  },

  methods: {
    clear () {
      const ctx = this.$refs.canvas.getContext('2d')
      ctx.clearRect(0, 0, this.w, this.h)
    },

    loop: function () {
      const now = Date.now()
      const delta = (now - then) / 100
      then = now

      const ctx = this.$refs.canvas.getContext('2d')

      count = count + (delta * this.speed)

      this.clear()

      ctx.lineWidth = 1
      ctx.lineCap = 'round'
      for (let i = 0; i < this.circlesNeeded; i++) {
        // const base = (i + count) % this.circleDistance

        const radius = (i * (this.circleDistance)) + count % (this.circleDistance)
        // const step = count % this.circleDistance

        const color = (((count / 5) - i) % (this.circleDistance))

        const r = scaleBetween(color, [0, this.circleDistance], [240, 250])
        const g = r
        const b = r

        ctx.strokeStyle = `rgb(${r},${g},${b})`
        ctx.beginPath()
        ctx.arc(this.center.x, this.center.y, radius, 0, Math.PI * 2, true)
        ctx.stroke()
      }

      window.requestAnimationFrame(this.loop)
    },

    setSizes () {
      this.clear()
      const canvas = this.$refs.canvas
      // const dpi = window.devicePixelRatio

      this.w = window.innerWidth
      this.h = window.innerHeight

      canvas.width = this.w
      canvas.height = this.h

      // canvas.getContext('2d').scale(dpi, dpi)
    }
  },

  mounted () {
    this.setSizes()

    this.loop()
  }
}
</script>

<style lang="scss">
.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  // background: #f9f9f8;
  pointer-events: none;

  canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
