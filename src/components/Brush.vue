<template>
  <div class="absolute anchor" v-bind:style="anchorStyle">
    <div class="absolute brush" v-bind:style="brushStyle"></div>
    <div class="absolute lazy-area" v-bind:style="lazyStyle"></div>
  </div>
</template>

<script>
import { DEFAULT_COLOR, RADIUS_DEFAULT } from '@/settings'

export default {
  name: 'Brush',

  props: {
    brush: {
      type: Object,
      default: () => {
        return {
          radius: RADIUS_DEFAULT,
          color: DEFAULT_COLOR
        }
      }
    },
    lazyRadius: {
      type: Number,
      default: RADIUS_DEFAULT
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
