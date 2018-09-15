<template>
  <div
    class="btn btn--bare tool-slider pointer-area"
    :class="classes"
    :style="style"
    @wheel="handleWheel"
  >
    <div>
      <div class="label pdg0 mrgb- tool-slider__label">{{ $t('tools.' + tool.id) }}</div>
      <input type="range" :min="min" :max="max" :step="step" :value="value" @input="handleInput" />
    </div>
  </div>
</template>

<script>
import ToolbarItem from '@/components/Desktop/Toolbar/Item.vue'

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
    },

    handleInput (e) {
      this.handleValueChange(parseFloat(e.target.value))
    }
  }
}
</script>

<style lang="scss">
.btn.tool-slider {
  padding: 1rem;
  width: 100%;
  text-align: left;
  transition: 0.15s transform;
  > div {
    flex: 1;
  }
}

.tool-slider__label {
  margin-bottom: 0.5rem;
}

.tool-slider__preview {
  z-index: -1;
  position: absolute;
  top: -1px;
  left: 100%;
  width: 15rem;
  bottom: -1px;
  background: white;
  border: 1px solid $alt-color-light;
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
