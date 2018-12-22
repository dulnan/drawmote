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

  data () {
    return {
      w: 0,
      h: 0,
      dpi: 1,
      running: true
    }
  },

  computed: {
    circlesNeeded () {
      const max = Math.max(this.w, this.h)
      return Math.ceil(max / this.circleDistance)
    },

    circleDistance () {
      return this.w >= 640 ? 35 : 35
    },

    speed () {
      return this.w >= 640 ? 5 : 5
    },

    center () {
      return {
        x: this.w / 2,
        y: this.h / 2
      }
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
      if (!this.running) {
        return
      }

      const now = Date.now()
      const delta = (now - then) / 100
      then = now

      const ctx = this.$refs.canvas.getContext('2d')

      count = count + (delta * this.speed)

      this.clear()

      ctx.lineWidth = 1
      ctx.lineCap = 'round'

      for (let i = 0; i < this.circlesNeeded; i++) {
        const radius = (i * (this.circleDistance)) + (count % (this.circleDistance))
        const opacity = 1 - (radius / (this.w / 2))

        // const end = 1 - ((i * count) % this.circleDistance) / this.circleDistance
        ctx.strokeStyle = `rgba(200,200,200,${opacity})`

        ctx.beginPath()
        ctx.arc(this.center.x, this.center.y, radius, 0, Math.PI * 2, true)
        ctx.stroke()
      }

      window.requestAnimationFrame(this.loop)
    },

    setSizes () {
      this.clear()

      const canvas = this.$refs.canvas
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

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
  },

  beforeDestroy () {
    this.running = false
  }
}
</script>

<style lang="scss">
.background-animation {
  position: absolute;
  top: auto;
  bottom: 0;
  left: -0.7em;
  width: 2em;
  height: 2em;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  transform: rotateX(90deg) translateY(1.25em);
  transform-origin: bottom;
  @include media('sm') {
    z-index: 0;
  }

  canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
