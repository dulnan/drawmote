<template>
  <div
    class="btn btn--bare tool-slider pointer-area sm-pdg-- md-pdg- lg-pdg w-100"
    :class="classes"
    :style="style"
    @wheel="handleWheel"
  >
    <div class="">
      <div class="tool-slider__text">
        <div class="tool-slider__label label pdg0 tool-slider__label">{{ $t('tools.' + tool.id) }}</div>
        <span class="tool-slider__value label flex-1 text-muted text-light pdg0">{{ roundedValue }}</span>
      </div>
      <input type="range" :min="min" :max="max" :step="step" :value="value" @input="handleInput" />
    </div>
  </div>
</template>

<script>
import ToolbarItem from '@/components/Desktop/Toolbar/Item.vue'

let timeout = null

export default {
  extends: ToolbarItem,

  name: 'ToolbarSlider',

  data () {
    return {
      min: 0,
      max: 100,
      value: 0,
      step: 1,
      multiplier: 0.5
    }
  },

  computed: {
    roundedValue () {
      return Math.round(this.value)
    }
  },

  methods: {
    handleWheel (e) {
      const delta = Math.max(Math.min(e.deltaY, 6), -6)
      const newValue = Math.round((Math.max(Math.min(this.value - (delta * this.multiplier), this.max), this.min)) * 100) / 100
      this.handleValueChange(newValue)

      if (!timeout) {
        timeout = window.setTimeout(() => {
          this.$track('Toolbar', this.tool.id, this.value)
        }, 8000)
      }
    },

    handleInput (e) {
      this.handleValueChange(parseFloat(e.target.value))
    }
  }
}
</script>

<style lang="scss">
.btn.tool-slider {
  text-align: left;
  transition: 0.15s transform;
  position: relative;
  overflow: visible;
  display: flex;
  > div {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  input {
    display: block;
    margin: 0;
    height: 4px;
  }
}

.tool-slider__text {
  margin-bottom: auto;
  @include media('lg') {
    display: flex;
  }
}

.tool-slider__value {
  @include media('md') {
  }
  @include media('lg') {
    font-size: 1.5rem;
    line-height: 1.15;
    text-align: right;
  }
}
</style>
