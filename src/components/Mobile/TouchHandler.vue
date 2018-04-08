<template>
  <div class="mobile-touch-handler absolute overlay" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
  </div>
</template>

<script>
import { gyro } from '@/libs/gyro.js'

const SWIPE_THRESHOLD = 30
const SWIPE_RESTRAINT = 100
const SLIDE_AREA = 140

let touchTimeout = {}

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

    initDataLoop () {
      gyro.frequency = 10
      gyro.startTracking(data => {
        let alpha = data.alpha

        if (data.alpha > 180) {
          alpha = Math.abs((data.alpha - 180) - 180)
        } else {
          alpha = (180 - data.alpha) - 180
        }

        let beta = data.beta
        let gamma = data.gamma

        this.$socket.emit('sendOrientation', {
          alpha: alpha,
          beta: beta,
          gamma: gamma,
          isPressing: this.isPressing
        })
      })
    }
  },

  mounted () {
    this.initDataLoop()
  }
}
</script>
