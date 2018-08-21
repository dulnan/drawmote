<template>
  <button
    class="button tool-slider pointer-area"
    :class="classes"
    :style="style"
  >
    <div class="label">{{ tool.id }}</div>
      <div class="tool-slider__range" ref="sliderRange">
        <div class="tool-slider__knob" :style="knobStyle" ref="sliderKnob"></div>
      </div>
    </div>
    <transition name="appear">
      <div class="tool-slider__preview" v-show="isSliding">
        <div class="relative">
          <!--<brush :is-preview="true" />-->
        </div>
      </div>
    </transition>
  </button>
</template>

<script>
import ToolbarItem from '@/components/Desktop/Toolbar/Item.vue'
import Brush from '@/components/Brush.vue'

export default {
  extends: ToolbarItem,

  components: {
    Brush
  },

  name: 'ToolbarSlider',

  data () {
    return {
      rangeWidth: 0,
      lastTouchY: 0,
      valueStart: 0,
      touchYStart: 0,
      valueMin: 0,
      valueMax: 0,
      brush: {}
    }
  },

  methods: {
    loop () {
      const touchY = this.$global.slideY

      if (touchY !== this.lastTouchY) {
        this.lastTouchY = touchY

        const newValue = Math.max(Math.min(Math.round(this.valueStart - ((touchY - this.touchYStart) / 2)), this.valueMax), this.valueMin)
        this.handleValueChange(newValue)
      }

      if (this.isSliding) {
        window.requestAnimationFrame(this.loop)
      }
    },

    initSlider () {
    },

    handleTouchChange () {},

    calculateRangeWidth () {
      this.rangeWidth = this.$refs.sliderRange.getBoundingClientRect().width - this.$refs.sliderKnob.getBoundingClientRect().width
    }
  },

  computed: {
    isSliding () {
      return this.hoveredKey === this.itemKey && this.isPressing
    },

    knobStyle () {
      const translate = (this.valueStore / this.valueMax) * this.rangeWidth
      return {
        transform: `translateX(${translate}px)`
      }
    }
  },

  watch: {
    isSliding: function (isSliding) {
      if (isSliding) {
        this.valueStart = this.valueStore
        this.touchYStart = this.$global.slideY
        this.lastTouchY = 0
        this.loop()
      }
    }
  },

  mounted () {
    this.calculateRangeWidth()
    this.initSlider()
  }
}
</script>

<style lang="scss">
.tool-slider {
  padding: 1.5rem 1rem;
  width: 100%;
  text-align: left;
  transition: 0.15s transform;

  &.hover {
    background: $color-greylighter;
    box-shadow: 0 0 0 1px rgba($color-greydark, 0.5);
  }
}

.tool-slider__range {
  background: $color-greylight;
  height: 0.25rem;
  width: 100%;
  position: relative;
}

.tool-slider__knob {
  position: absolute;
  top: -5px;
  left: 0;
  height: 0.75rem;
  width: 0.75rem;
  background: $color-greydark;
  border-radius: 100%;
}

.tool-slider__preview {
  z-index: -1;
  position: absolute;
  top: -1px;
  left: 100%;
  width: 15rem;
  bottom: -1px;
  background: white;
  border: 1px solid $color-greylight;
  display: flex;
  align-items: center;
  justify-content: center;
  &.appear-enter-active, &.appear-leave-active {
    transition: .2s;
  }
  &.appear-enter, &.appear-leave-to {
    opacity: 0;
    transform: translate(-100%);
  }
}
</style>
