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
    </ul>
  </div>
</template>

<script>
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
      this.$emit('setBrushColor', newColor)
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
  border-radius: 100%;
  width: 5rem;
  height: 5rem;
}
</style>
