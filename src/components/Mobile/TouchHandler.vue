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
      <div class="click-area" :class="{ 'is-clicking': isClicking }">
        <div class="click-area__circle"></div>
      </div>
    </div>

    <div class="calibration pdg">
      <button
        class="btn btn--primary btn--block"
        @click="calibrate"
      >
        <span>{{ $t('mobile.calibrationButton') }}</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TouchHandler',

  data () {
    return {
      isClicking: false,
      touchStartY: 0,
      touchStartTime: {},
      touchDiffY: 0
    }
  },

  watch: {
    isClicking (isClicking) {
      this.$mote.updateClick(isClicking)
    },

    touchDiffY (diffY) {
      this.$mote.updateTouch({ x: 0, y: diffY })
    }
  },

  methods: {
    handleMainTouchStart (e) {
      e.preventDefault()

      this.touchDiffY = 0
      this.touchStartY = 0
      this.touchStartTime = new Date().getTime()

      this.isClicking = true
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

      this.isClicking = false
    },

    handleMainTouchCancel (e) {
      e.preventDefault()

      this.isClicking = false
      this.touchDiffY = 0
    },

    calibrate () {
      this.$mote.calibrate()
    }
  }
}
</script>

<style lang="scss">
.mobile-controller {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 53px;
}
.mobile-touch {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.calibration {
  margin-top: auto;
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
  border: 1px solid rgba($alt-color-darkest, 0.5);
  background: linear-gradient(lighten($alt-color-darkest, 0%), lighten($alt-color-darkest, 2%));
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 1rem;
    left: 1rem;
    bottom: 1rem;
    right: 1rem;
    border-radius: inherit;

background: linear-gradient(0deg, lighten($alt-color-darkest, 2%), lighten($alt-color-darker, 4%));
    box-shadow: inset 0 3px 10px rgba($alt-color-dark, 0.15),
                inset 0 4px 2px rgba($alt-color-dark, 0.1);

  }
  .is-clicking & {
    &:before {
    background: linear-gradient(lighten($alt-color-darkest, 1%), lighten($alt-color-darker, 9%));
    box-shadow: 0 3px 10px rgba($alt-color-dark, 0.35),
              0 4px 3px rgba($alt-color-dark, 0.5),
              inset 0 4px 3px rgba($alt-color, 0.5);
        }
  }
}
</style>
