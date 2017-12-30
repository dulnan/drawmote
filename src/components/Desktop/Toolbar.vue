<template>
  <div class="absolute overlay toolbar flex" v-bind:class="{ 'visible': this.visible }" @click.prevent="changeColor()">
    <ul class="toolbar-list list flex" v-bind:style="listStyle">
      <li v-for="(color, index) in colors" class="toolbar__item pdg-">
        <button
          type="button"
          class="button toolbar__button"
          v-bind:style="getStyleObject(color.rgb, index)"
          v-bind:class="{ 'selected' : index === selectedIndex }"
        ></button>
      </li>
    </ul>
  </div>
</template>

<script>
import { EventBus } from '@/events'

import { COLORS } from '@/settings'
import { getRgbaString, scaleBetween } from '@/tools/helpers.js'

export default {
  name: 'Toolbar',

  data () {
    return {
      colors: COLORS,
      selectedIndex: 3,
      movingIndex: 3
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
    },
    coordsX: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    }
  },

  watch: {
    coordsX: function (newCoordsX) {
      const index = scaleBetween(newCoordsX, [0, this.width], [0, this.colors.length - 1])
      this.movingIndex = index
      this.selectedIndex = Math.round(index)
    },
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
        transform: `translateX(-${this.movingIndex * 100}%)`
      }
    }
  },

  methods: {
    getStyleObject (rgb, index) {
      const offset = Math.min(Math.abs(index - this.movingIndex), 1)
      const scaling = (2 - offset) / 1.25
      const translate = Math.max(Math.min((index - this.movingIndex), 1), -1) * 50
      return {
        background: getRgbaString(rgb, 1),
        transform: `scale(${scaling}) translateX(${translate}%)`
      }
    },

    changeColor () {
      const newColor = this.colors[this.selectedIndex]
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
  background: rgba(white, 0.8);
  z-index: $index-toolbar;
  opacity: 0;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transform: scale(1.2);
  transition: 0.3s ease-in-out;

  &.visible {
    opacity: 1;
    pointer-events: all;
    transform: none;
  }
}

.toolbar-list {
  width: 6rem;
  height: 6rem;
}

.toolbar__button {
  background: white;
  border-radius: 100%;
  width: 5rem;
  height: 5rem;
  opacity: 0.5;
  &.selected {
    border: 4px solid rgba(black, 0.05);
    opacity: 1;
  }
}
</style>
