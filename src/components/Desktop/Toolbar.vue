<template>
  <div class="absolute overlay toolbar flex" v-bind:class="{ 'visible': this.visible }">
    <ul class="toolbar-list list flex" v-bind:style="listStyle">
      <li v-for="(color, index) in colors" class="toolbar__item pdg-">
        <button
          type="button"
          class="button toolbar__button"
          v-bind:style="getStyleObject(color.rgb, index)"
          v-bind:class="{ 'selected' : color.name === selectedColor.name }"
          @click.prevent="changeColor(color)"
        ></button>
      </li>
    </ul>
  </div>
</template>

<script>
import { EventBus } from '@/events'

import { COLORS } from '@/settings'
import { getRgbaString } from '@/tools/helpers.js'

export default {
  name: 'Toolbar',

  data () {
    return {
      colors: COLORS,
      selectedIndex: 3
    }
  },

  props: {
    selectedColor: {
      type: Object,
      default: () => {
        return COLORS[3]
      }
    },
    visible: {
      type: Boolean,
      default: true
    }
  },

  watch: {
    selectedColor: {
      handler (newColor) {
        this.colors.forEach((color, index) => {
          if (color.name === newColor.name) {
            this.selectedIndex = index
          }
        })
      },
      deep: true
    }
  },

  computed: {
    listStyle: function () {
      return {
        transform: `translateX(-${this.selectedIndex * 100}%)`
      }
    }
  },

  methods: {
    getStyleObject (rgb, index) {
      const offset = Math.min(Math.abs(index - this.selectedIndex), 1)
      const scaling = (2 - offset) / 1.25
      const translate = Math.max(Math.min((index - this.selectedIndex), 1), -1) * 50
      return {
        background: getRgbaString(rgb, 1),
        transform: `scale(${scaling}) translateX(${translate}%)`
      }
    },

    changeColor (newColor) {
      EventBus.$emit('setBrushColor', newColor)
    },

    clearCanvas () {
      EventBus.$emit('clearCanvas')
    },

    showColorPick () {
      EventBus.$emit('showColorPick')
    }
  },

  mounted () {
    EventBus.$on('swipeUp', () => { this.visible = true })
    EventBus.$on('swipeDown', () => { this.visible = false })
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  background: rgba(black, 0.1);
  z-index: $index-toolbar;
  opacity: 0;
  align-items: center;
  justify-content: center;

  &.visible {
    opacity: 1;
  }
}

.toolbar-list {
  width: 6rem;
  height: 6rem;
  transition: 0.4s;
}

.toolbar__button {
  background: white;
  border-radius: 100%;
  width: 5rem;
  height: 5rem;
  border: 4px solid white;
  transition: 0.4s;
}
</style>
