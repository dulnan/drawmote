<template>
  <div class="absolute overlay color-picker">
    <div class="color overlay" v-bind:style="colorStyle"></div>

  </div>
</template>

<script>
import { EventBus } from '@/events'
import { scaleBetween } from '@/tools/helpers.js'

export default {
  name: 'ColorPicker',

  sockets: {
    receiveOrientation: function (data) {
      const color = {
        s: Math.round(scaleBetween(Math.max(data.alpha + 40, 0), [0, 80], [0, 360])),
        h: Math.round(scaleBetween(Math.max(data.beta + 80, 0), [0, 160], [0, 100])),
        l: Math.round(scaleBetween(Math.max(data.gamma + 30, 0), [0, 60], [0, 100]))
      }
      this.color = color
    }
  },

  data () {
    return {
      color: {
        h: 0,
        s: 0,
        l: 0
      }
    }
  },

  props: {
    mobileOrientation: {
      type: Object,
      default: () => {
        return {
          alpha: 0,
          beta: 0,
          gamma: 0
        }
      }
    }
  },

  computed: {
    colorStyle: function () {
      return {
        background: `hsl(${this.color.h}, ${this.color.s}%, ${this.color.l}%)`
      }
    }
  },

  methods: {
    changeColor (newColor) {
      EventBus.$emit('setBrushColor', newColor)
    }
  }
}
</script>

<style lang="scss" scoped>
.color-picker {
  z-index: $index-color-picker;
}
</style>
