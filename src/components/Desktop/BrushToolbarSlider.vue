<template>
  <button
    class="button tool-slider pointer-area pdg"
    :class="classes"
    :style="style"
  >
    <div class="label">{{ tool.id }}</div>
      <div class="tool-slider__slider">
        <div class="tool-slider__knob"></div>
      </div>
    </div>
  </button>
</template>

<script>
import BrushToolbarItem from '@/components/Desktop/BrushToolbarItem.vue'

export default {
  extends: BrushToolbarItem,

  name: 'BrushToolbarSlider',

  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
.tool-slider {
  width: 100%;
  text-align: left;
  transition: 0.15s transform;

  &.hover {
    background: $color-greylighter;
    box-shadow: 0 0 0 1px rgba($color-greydark, 0.5);
  }
}



.tool-slider__slider {
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
</style>
