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
      <div class="click-area" :class="{ 'is-pressing': isPressingMain }">
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
import Smoothing from '@/classes/Smoothing'
import { buildDataString } from '@/tools/helpers.js'
import GyroNorm from 'gyronorm'

require('@hughsk/fulltilt/dist/fulltilt.min.js')
let deviceOrientation

let smoothAlpha = new Smoothing()
let smoothBeta = new Smoothing()

export default {
  name: 'TouchHandler',

  data () {
    return {
      isPressingMain: false,
      touchStartY: 0,
      touchStartTime: {},
      touchDiffY: 0,
      alpha: 0,
      beta: 0,
      lastOrientationString: ''
    }
  },

  computed: {
    rounding () {
      return this.isPressingMain ? 100 : 25
    }
  },

  methods: {
    handleMainTouchStart (e) {
      e.preventDefault()

      this.touchDiffY = 0
      this.touchStartY = 0
      this.touchStartTime = new Date().getTime()

      this.isPressingMain = true
    },

    handleMainTouchMove (e) {
      e.preventDefault()

      const diffTime = new Date().getTime() - this.touchStartTime
      const touch = e.changedTouches[0]

      if (diffTime > 50) {
        if (this.touchStartY === 0) {
          this.touchStartY = touch.pageY
        }
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
      this.updateOrientationOffset()
    },

    initDataLoop () {
      deviceOrientation = new GyroNorm()

      const options = {
        frequency: 5,
        decimalCount: 6
      }

      deviceOrientation.init(options).then(() => {
        deviceOrientation.start((data) => {
          this.alpha = Math.round((smoothAlpha.next((data.do.alpha + 180) % 360, this.isPressingMain)) * this.rounding) / this.rounding
          this.beta = Math.round((smoothBeta.next(data.do.beta, this.isPressingMain)) * this.rounding) / this.rounding
        })

        this.dataLoop()
      }).catch((e) => {
        alert(e)
      })
    },

    updateOrientationOffset (newOrientationOffset) {
      this.$mote.emit('OrientationOffset', {
        alpha: this.alpha,
        beta: this.beta
      })
    },

    dataLoop () {
      const touchDiffY = this.touchDiffY

      const alpha = this.alpha
      const beta = this.beta

      const newData = buildDataString(alpha, beta, this.isPressingMain, touchDiffY)
      if (newData !== this.lastOrientationString) {
        this.$mote.send('Orientation', newData)
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
  padding-top: 0;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding-bottom: 53px;
}
.mobile-touch {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.calibration {
  margin-top: auto;
  border-top: 1px solid $alt-color-light;
  background: white;
}

.click-area {
  display: flex;
  align-items: center;
  flex: 1;
}

.click-area__circle {
  width: 70vw;
  height: 70vw;
  padding: 1rem;
  margin: 0 auto;
  border-radius: 100%;
  border: 1px solid $alt-color-lighter;
  background: linear-gradient(lighten($alt-color-lighter, 0%), lighten($alt-color-lighter, 2%));
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 1rem;
    left: 1rem;
    bottom: 1rem;
    right: 1rem;
    border-radius: inherit;
    background: linear-gradient(lighten($alt-color-lighter, 1%), lighten($alt-color-light, 9%));
    box-shadow: 0 3px 10px rgba($alt-color, 0.15),
              0 4px 3px rgba($alt-color, 0.3),
              inset 0 4px 3px rgba(white, 0.5);
  }
  .is-pressing & {
    &:before {
    background: linear-gradient(0deg, lighten($alt-color-lighter, 2%), lighten($alt-color-light, 4%));
    box-shadow: inset 0 3px 10px rgba($alt-color, 0.15),
                inset 0 4px 2px rgba($alt-color, 0.1);
    }
  }
}
</style>
