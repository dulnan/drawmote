<template>
  <div class="absolute anchor" v-bind:style="anchorStyle">
    <div class="absolute brush" v-bind:style="brushStyle"></div>
  </div>
</template>

<script>
import { DEFAULT_COLOR, DEFAULT_RADIUS } from '@/settings'

export default {
  name: 'Brush',

  props: {
    brush: {
      type: Object,
      default: () => {
        return {
          radius: DEFAULT_RADIUS,
          color: DEFAULT_COLOR
        }
      }
    },
    coordinates: {
      type: Object,
      default: () => {
        return {
          x: 0,
          y: 0
        }
      }
    }
  },

  computed: {
    anchorStyle: function () {
      return {
        transform: `translate(${this.coordinates.x}px, ${this.coordinates.y}px)`
      }
    },
    brushStyle: function () {
      return {
        background: this.brush.color.hex,
        width: `${this.brush.radius * 2}px`,
        height: `${this.brush.radius * 2}px`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.anchor {
  width: 1px;
  height: 1px;
  z-index: $index-brush;
}

.brush {
  border-radius: 100%;
  transform: translate(-50%, -50%);
  user-select: none;
}
</style>
