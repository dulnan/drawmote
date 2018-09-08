<template>
  <div class="mobile-controller">
    <div
      class="mobile-touch pdg"
      @touchstart="handleMainTouchStart"
      @touchmove="handleMainTouchMove"
      @touchend="handleMainTouchEnd"
      @touchcancel="handleMainTouchCancel"
    >
      <div class="h3 text-muted">{{ $t('mobile.controllingInfo') }}</div>
      <div class="click-area">
        <div class="click-area__circle"></div>
      </div>
    </div>

    <div class="calibration pdg">
      <button
        class="btn btn--primary btn--block"
        @click="handleCalibrateClick"
      >
        <span>{{ $t('mobile.calibrationButton') }}</span>
      </button>
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
  flex-direction: column;
}
.mobile-touch {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.calibration {
  margin-top: auto;
  border-top: 1px solid $alt-color-light;
}

.click-area {
  display: flex;
  align-items: center;
  flex: 1;
}

.click-area__circle {
  width: 14rem;
  height: 14rem;
  margin: 0 auto;
  border-radius: 100%;
  border: 1px solid #ccc;
}
</style>
