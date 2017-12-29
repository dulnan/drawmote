<template>
  <div class="absolute anchor" v-bind:style="anchorStyle">
    <div class="absolute brush" v-bind:style="brushStyle"></div>
    <div v-if="useLazyBrush" class="absolute lazy-area" v-bind:style="lazyStyle"></div>
  </div>
</template>

<script>
import { RADIUS_DEFAULT, BRUSH_DEFAULT } from '@/settings'
import { getRgbaString } from '@/tools/helpers.js'

export default {
  name: 'Brush',

  props: {
    brush: {
      type: Object,
      default: BRUSH_DEFAULT
    },
    useLazyBrush: {
      type: Boolean,
      default: true
    },
    lazyRadius: {
      type: Number,
      default: () => {
        return RADIUS_DEFAULT
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
      const diameter = (this.brush.hardness + 1) * this.brush.radius
      return {
        background: getRgbaString(this.brush.color.rgb, this.brush.opacity),
        filter: `blur(${((1 - this.brush.hardness) * this.brush.radius)}px)`,
        width: `${diameter}px`,
        height: `${diameter}px`
      }
    },
    lazyStyle: function () {
      return {
        width: `${this.lazyRadius * 2}px`,
        height: `${this.lazyRadius * 2}px`
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
  user-select: none;
  pointer-events: none;
}

.brush, .lazy-area {
  border-radius: 100%;
  transform: translate(-50%, -50%);
  user-select: none;
  pointer-events: none;
}

.lazy-area {
  border: 1px solid rgba(black, 0.1);
}
</style>
