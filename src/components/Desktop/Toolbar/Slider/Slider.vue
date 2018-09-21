<template>
  <div
    class="btn btn--bare tool-slider pointer-area pdgh- pdgv- md-pdg w-100"
    :class="classes"
    :style="style"
    @wheel="handleWheel"
  >
    <div>
      <div class="label pdg0 lg-mrgb- tool-slider__label">{{ $t('tools.' + tool.id) }}</div>
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
      step: 0.1
    }
  },

  methods: {
    handleWheel (e) {
      const delta = Math.max(Math.min(e.deltaY, 5), -5) * (this.max / 100)
      const newValue = Math.max(Math.min(this.value - delta, this.max), this.min)
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
  > div {
    flex: 1;
  }
}
</style>
