<template>
  <div class="absolute overlay background-animation">
    <canvas ref="canvas" />
  </div>
</template>

<script>
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
      h: 0,
      dpi: 1
    }
  },

  computed: {
    circlesNeeded () {
      const max = Math.max(this.w, this.h)
      return Math.ceil(max / this.circleDistance)
    },

    circleDistance () {
      return this.w >= 640 ? 65 : 35
    },

    speed () {
      return this.w >= 640 ? 5 : 5
    }
  },

  watch: {
    center: function (center) {
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
      ctx.strokeStyle = '#ecebe7'

      for (let i = 0; i < this.circlesNeeded; i++) {
        const radius = (i * (this.circleDistance)) + (count % (this.circleDistance))
        ctx.beginPath()
        ctx.arc(this.center.x, this.center.y, radius, 0, Math.PI * 2, true)
        ctx.stroke()
      }

      window.requestAnimationFrame(this.loop)
    },

    setSizes () {
      this.clear()

      const canvas = this.$refs.canvas
      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      let dpi = 1

      if (width < 641) {
        dpi = Math.min(window.devicePixelRatio, 1.5)
      }

      canvas.width = width * dpi
      canvas.height = height * dpi

      canvas.getContext('2d').scale(dpi, dpi)

      this.w = width
      this.h = height
      this.dpi = dpi
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
  width: 100vw;
  height: 100vh;
  z-index: 0;
  // background: #f9f9f8;
  pointer-events: none;
  overflow: hidden;
  @include media('sm') {
    z-index: -1;
  }

  canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
