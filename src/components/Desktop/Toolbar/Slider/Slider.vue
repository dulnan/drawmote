<template>
  <div
    class="btn btn--bare tool-slider pointer-area pdgh- pdgv- md-pdg w-100"
    :class="classes"
    :style="style"
    @wheel="handleWheel"
  >
    <div class="">
      <div class="tool-slider__value mrgb-">
        <div class="label pdg0 tool-slider__label">{{ $t('tools.' + tool.id) }}</div>
        <span class="label flex-1 text-right text-muted text-light">{{ roundedValue }}</span>
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
  align-items: center;
  > div {
    flex: 1;
  }
  input {
    display: block;
    margin: 0;
  }
}

.tool-slider__value {
  @include media('lg') {
    display: flex;
  }
}

</style>
