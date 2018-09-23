<template>
  <div
    class="btn btn--bare tool-slider pointer-area pdgh- pdgv- md-pdg w-100"
    :class="classes"
    :style="style"
    @wheel="handleWheel"
  >
    <div>
      <div class="label pdg0 lg-mrgb- tool-slider__label">{{ $t('tools.' + tool.id) }}</div>
      <div class="tool-slider__value text-right">
        <span class="h3">{{ roundedValue }}</span>
        <span class="text-light text-muted"> / {{ this.max }}</span>
      </div>
      <div class="tool-slider__slider">
        <input type="range" :min="min" :max="max" :step="step" :value="value" @input="handleInput" />
      </div>
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
      console.log(e)
      const delta = e.deltaY
      // const delta = Math.max(Math.min(e.deltaY * this.multiplier, 6), -6)
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
}

.tool-slider__slider {
  position: absolute;
  top: 100%;
  left: -1px;
  right: -1px;
  height: 16rem;
  border: 1px solid $alt-color-lighter;
  opacity: 0;
  .hover & {
    opacity: 1;
  }
  input {
    display: block;
    width: 16rem;
    margin: 0;
    transform-origin: top left;
    transform: rotate(90deg);
  }
}
</style>
