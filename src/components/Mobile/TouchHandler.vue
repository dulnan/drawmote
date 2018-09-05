<template>
  <div class="mobile-controller mobile-font-size">
    <div
      class="mobile-touch mobile-touch--main"
      @touchstart="handleMainTouchStart"
      @touchmove="handleMainTouchMove"
      @touchend="handleMainTouchEnd"
      @touchcancel="handleMainTouchCancel"
    >
      <div class="lead mobile-controller__text">
        Move your phone and point it at the screen. Press the circle to click or draw.
        Interact with sliders by sliding up and down.
      </div>
      <div class="click-area"></div>
    </div>

    <div class="calibration">
      <button class="button button--primary button--responsive" @click="handleCalibrateClick"><span>Reset to center</span></button>
    </div>
  </div>
</template>

<script>
import { buildDataString } from '@/tools/helpers.js'

import GyroNorm from 'gyronorm'
require('@hughsk/fulltilt/dist/fulltilt.min.js')
var deviceOrientation

export default {
  name: 'TouchHandler',

  data () {
    return {
      isPressingMain: false,
      touchStartY: 0,
      touchStartTime: {},
      touchDiffY: 0,
      orientation: {
        alpha: 0,
        beta: 0,
        gamma: 0
      },
      lastOrientationString: ''
    }
  },

  methods: {
    handleAsideTouchEnd (e) {
      e.preventDefault()

      /* const touch = e.changedTouches[0] */
      /* const diffX = touch.pageX - this.touchStart.x */
      /* const diffY = touch.pageY - this.touchStart.y */
      /* const diffTime = new Date().getTime() - this.touchStart.time */
      /*  */
      /* let direction = '' */
      /*  */
      /* if (diffTime <= 300) { */
      /*   if (Math.abs(diffX) >= SWIPE_THRESHOLD && Math.abs(diffY) <= SWIPE_RESTRAINT) { */
      /*     direction = (diffX < 0) ? 'left' : 'right' */
      /*   } else if (Math.abs(diffY) >= SWIPE_THRESHOLD && Math.abs(diffX) <= SWIPE_RESTRAINT) { */
      /*     direction = (diffY < 0) ? 'up' : 'down' */
      /*   } */
      /* } */
      /*  */
      /* if (direction) { */
      /*   this.handleSwipe(direction) */
      /* } */
    },

    handleMainTouchStart (e) {
      e.preventDefault()

      this.touchDiffY = 0
      this.touchStartY = e.changedTouches[0].pageY
      this.touchStartTime = new Date().getTime()

      this.isPressingMain = true
    },

    handleMainTouchMove (e) {
      e.preventDefault()

      const diffTime = new Date().getTime() - this.touchStartTime
      const touch = e.changedTouches[0]

      if (diffTime > 50) {
        this.touchDiffY = touch.pageY - this.touchStartY
      }
    },

    handleMainTouchEnd (e) {
      e.preventDefault()

      this.isPressingMain = false
    },

    handleMainTouchCancel (e) {
      e.preventDefault()

      this.isPressingMain = false
      this.touchDiffY = 0
    },

    handleCalibrateClick () {
      this.updateOrientationOffset(this.orientation)
    },

    initDataLoop () {
      deviceOrientation = new GyroNorm()

      const options = {
        frequency: 10,
        decimalCount: 0
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
      this.$connection.emit('OrientationOffset', {
        alpha: newOrientationOffset.alpha,
        beta: newOrientationOffset.beta
      })
    },

    dataLoop () {
      const newData = buildDataString(this.orientation, this.isPressingMain, this.touchDiffY)
      if (newData !== this.lastOrientationString) {
        this.$connection.emit('Orientation', newData)
        this.lastOrientationString = newData
      }
      window.requestAnimationFrame(this.dataLoop)
    }
  },

  created () {
    this.initDataLoop()
  }
}
</script>

<style lang="scss">
.mobile-controller {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  padding: 2rem;
}
.mobile-controller__text {
  font-size: 0.5em !important;
}
.mobile-touch {
}
.mobile-touch--main {
  height: 100%;
  flex: 5;
}
.calibration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  z-index: 1000000;
  background: white;
  border-top: 1px solid $color-greylight;
}

.click-area {
  width: 6em;
  height: 6em;
  margin: 1em auto 0;
  border-radius: 100%;
  border: 1px solid #ccc;
}
</style>
