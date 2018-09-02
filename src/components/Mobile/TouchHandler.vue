<template>
  <div class="mobile-controller">
    <div
      class="mobile-touch mobile-touch--main"
      @touchstart="handleMainTouchStart"
      @touchmove="handleMainTouchMove"
      @touchend="handleMainTouchEnd"
      @touchcancel="handleMainTouchCancel">
    </div>

    <div style="position: absolute; top: 400px; z-index: 9999; pointer-events: none">
      <div><span style="width: 200px; display: inline-block;">Alpha</span>{{ Math.round(orientation.alpha) }}</div>
      <div><span style="width: 200px; display: inline-block;">Beta</span>{{ Math.round(orientation.beta) }}</div>
      <div><span style="width: 200px; display: inline-block;">Gamma</span>{{ Math.round(orientation.gamma) }}</div>
      <div><span style="width: 200px; display: inline-block;">isPressingMain</span>{{ isPressingMain }}</div>
      <div><span style="width: 200px; display: inline-block;">isPressingAside </span>{{ isPressingAside }}</div>
    </div>

    <div class="calibration">
      <button class="button" @click="handleCalibrateClick">Calibrate</button>
    </div>
  </div>
</template>

<script>
import { buildDataString } from '@/tools/helpers.js'

require('@hughsk/fulltilt/dist/fulltilt.min.js')
var GyroNorm = require('gyronorm')
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

      this.isPressingAside = false
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
    background: blue;
    right: 0;
    display: flex;
  }
  .mobile-touch {
  }
  .mobile-touch--main {
    background: red;
    height: 100%;
    flex: 5;
  }
  .mobile-touch--aside {
    background: green;
    height: 100%;
    flex: 2;
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
