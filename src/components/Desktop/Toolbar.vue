<template>
  <div class="absolute toolbar">
    <ul class="list flex">
      <li v-for="color in colors" class="mrgr">
        <button
          type="button"
          class="button toolbar__button"
          v-bind:style="{ background: color.hex }"
          v-bind:class="{ 'selected' : color.hex === selectedColor.hex }"
          @click.prevent="changeColor(color)"
        ></button>
      </li>
      <li>
        <button
          type="button"
          class="button toolbar__button"
          @click.prevent="clearCanvas"
        ></button>
      </li>
      <li>
        <button
          type="button"
          class="button toolbar__button"
          @click.prevent="showColorPick"
        ></button>
      </li>
    </ul>
  </div>
</template>

<script>
import { EventBus } from '@/events'

import { COLORS } from '@/settings'

export default {
  name: 'Toolbar',

  data () {
    return {
      colors: COLORS
    }
  },

  props: {
    selectedColor: {
      type: Object,
      default: () => {
        return COLORS[3]
      }
    }
  },

  methods: {
    changeColor (newColor) {
      EventBus.$emit('setBrushColor', newColor)
    },

    clearCanvas () {
      EventBus.$emit('clearCanvas')
    },

    showColorPick () {
      EventBus.$emit('showColorPick')
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  height: 5rem;
  width: 100%;
  background: rgba(black, 0.1);
  z-index: $index-toolbar;
}

.toolbar__button {
  background: white;
  border-radius: 100%;
  width: 5rem;
  height: 5rem;
  border: 4px solid white;
  &.selected {

  }
}
</style>
