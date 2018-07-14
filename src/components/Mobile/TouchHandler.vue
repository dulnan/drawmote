<template>
  <div>
    <div class="mobile-touch-handler absolute overlay" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    </div>

    <div style="position: absolute; top: 400px; z-index: 9999; pointer-events: none">
      <div><span style="width: 200px; display: inline-block;">Alpha</span>{{ Math.round(orientation.alpha) }}</div>
      <div><span style="width: 200px; display: inline-block;">Beta</span>{{ Math.round(orientation.beta) }}</div>
      <div><span style="width: 200px; display: inline-block;">Gamma</span>{{ Math.round(orientation.gamma) }}</div>
      <div><span style="width: 200px; display: inline-block;">isPressing</span>{{ isPressing }}</div>
    </div>

    <div class="calibration">
      <button class="button" @click="handleCalibrateClick">Calibrate</button>
    </div>
  </div>
</template>

<script>
require('@hughsk/fulltilt/dist/fulltilt.min.js')
var GyroNorm = require('gyronorm')

const SWIPE_THRESHOLD = 30
const SWIPE_RESTRAINT = 100
const SLIDE_AREA = 140

let touchTimeout = {}

var deviceOrientation

export default {
  name: 'TouchHandler',

  data () {
    return {
      isPressing: false,
      isSliding: false,
      slideStart: {
        x: 0,
        y: 0
      },
      touchStart: {
        x: 0,
        y: 0,
        time: {}
      },
      orientation: {
        alpha: 0,
        beta: 0,
        gamma: 0
      }
    }
  },

  methods: {
    handleTouchStart (e) {
      this.cancelTimeout()
      e.preventDefault()

      this.touchStart = {
        x: e.changedTouches[0].pageX,
        y: e.changedTouches[0].pageY,
        time: new Date().getTime()
      }

      touchTimeout = window.setTimeout(() => {
        this.isPressing = true
      }, 300)
    },

    handleTouchMove (e) {
      e.preventDefault()

      const diffTime = new Date().getTime() - this.touchStart.time
      const touch = e.changedTouches[0]

      if (!this.isSliding && diffTime > 300) {
        const diffX = touch.pageX - this.touchStart.x
        const diffY = touch.pageY - this.touchStart.y

        if (Math.abs(diffX) > SWIPE_THRESHOLD || Math.abs(diffY) > SWIPE_THRESHOLD) {
          this.$socket.emit('sendSlideState', { sliding: true })
          this.isSliding = true

          this.slideStart = {
            x: touch.pageX,
            y: touch.pageY
          }
        }
      }

      if (this.isSliding) {
        this.$socket.emit('sendSlideData', {
          x: Math.max(Math.min(touch.pageX - this.slideStart.x, SLIDE_AREA), -SLIDE_AREA),
          y: Math.max(Math.min(this.slideStart.y - touch.pageY, SLIDE_AREA), -SLIDE_AREA)
        })
      }
    },

    handleTouchEnd (e) {
      this.cancelTimeout()
      e.preventDefault()

      const touch = e.changedTouches[0]
      const diffX = touch.pageX - this.touchStart.x
      const diffY = touch.pageY - this.touchStart.y
      const diffTime = new Date().getTime() - this.touchStart.time

      let direction = ''

      if (diffTime <= 300) {
        if (Math.abs(diffX) >= SWIPE_THRESHOLD && Math.abs(diffY) <= SWIPE_RESTRAINT) {
          direction = (diffX < 0) ? 'left' : 'right'
        } else if (Math.abs(diffY) >= SWIPE_THRESHOLD && Math.abs(diffX) <= SWIPE_RESTRAINT) {
          direction = (diffY < 0) ? 'up' : 'down'
        }
      }

      if (direction) {
        this.handleSwipe(direction)
      }

      this.$socket.emit('sendSlideState', { sliding: false })

      this.isPressing = false
      this.isSliding = false
    },

    handleSwipe (direction) {
      this.$socket.emit('sendSwipe', direction)
    },

    cancelTimeout () {
      window.clearTimeout(touchTimeout)
    },

    handleCalibrateClick () {
      this.updateOrientationOffset(this.orientation)
    },

    initDataLoop () {
      deviceOrientation = new GyroNorm()

      const options = {
        frequency: 30,
        decimalCount: 3
      }

      deviceOrientation.init(options).then(() => {
        deviceOrientation.start((data) => {
          this.updateOrientation(data.do)
        })

        this.dataLoop()
      }).catch((e) => {
        alert(e)
      })
    },

    updateOrientation (newOrientation) {
      this.orientation = {
        alpha: newOrientation.alpha,
        beta: newOrientation.beta,
        gamma: newOrientation.gamma
      }
    },

    updateOrientationOffset (newOrientationOffset) {
      this.$socket.emit('sendOrientationOffset', {
        alpha: newOrientationOffset.alpha,
        beta: newOrientationOffset.beta
      })
    },

    dataLoop () {
      this.$socket.emit('sendOrientation', {
        alpha: this.orientation.alpha,
        beta: this.orientation.beta,
        gamma: this.orientation.gamma,
        isPressing: this.isPressing
      })

      window.requestAnimationFrame(this.dataLoop)
    }
  },

  mounted () {
    this.initDataLoop()
  }
}
</script>

<style lang="scss">
.mobile-touch-handler {
  z-index: 10000;
}
.calibration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  z-index: 1000000;
  background: white;
  .button {
    width: 100%;
    background: $color-yellow;
    padding: 1rem;
  }
}
</style>