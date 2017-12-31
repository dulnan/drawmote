<template>
  <div class="absolute toolbar" @click.prevent="changeColor()" v-bind:class="{ 'transitioning' : isTransitioning, 'visible': visible }">
    <ul class="toolbar-list list flex" v-bind:style="listStyle">
      <li v-for="(color, index) in colors" class="toolbar__item pdg-">
        <button
          type="button"
          class="button toolbar__button"
          v-bind:style="getStyleObject(color.rgb, index)"
          v-bind:class="{ 'selected' : index === selectedIndex }"
          @click.prevent="changeColor(color)"
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
      movingIndex: 3,
      timeout: {},
      isTransitioning: false
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
    visible: function () {
      window.clearTimeout(this.timeout)
      this.isTransitioning = true
      this.timeout = window.setTimeout(() => {
        this.isTransitioning = false
      }, 500)
    },
    coordsX: function (newCoordsX) {
      if (this.visible) {
        const index = scaleBetween(newCoordsX, [0, this.width], [0, this.colors.length - 1])
        this.movingIndex = index
        this.selectedIndex = Math.round(index)
      }
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
      let transform = 'none'
      if (this.visible) {
        // transform = `translateX(-${this.movingIndex * 100}%)`
      }

      return {
        transform: transform
      }
    }
  },

  methods: {
    getStyleObject (rgb, index) {
      const offset = Math.min(Math.abs(index - this.movingIndex), 1)
      const scaling = (2 - offset) / 1.25
      const translate = Math.max(Math.min((index - this.movingIndex), 1), -1) * 50

      let transform = 'none'

      if (this.visible) {
        transform = `scale(${scaling}) translateX(${translate}%)`
      }
      return {
        background: getRgbaString(rgb, 1),
        transform: transform
      }
    },

    changeColor (newColor) {
      const color = newColor || this.colors[this.selectedIndex]
      EventBus.$emit('setBrushColor', color)
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
  z-index: $index-toolbar;
  transition: 0.5s ease-in-out;
  transform-origin: top center;
  left: 50%;
  transform: translate(-50%, 0.75rem) scale(0.25);

  &.visible {
    transform: translateX(calc(-50%)) translateY(calc(100%));
  }

  &, &.transitioning * {
    transition: 0.5s;
    transition-timing-function: cubic-bezier(0.88, 0.52, 0.4, 1);
  }
}

.toolbar-list {
  // width: 6rem;
  // height: 6rem;
}

.toolbar__button {
  background: white;
  border-radius: 100%;
  width: 5rem;
  height: 5rem;
  opacity: 0.3;
  .visible & {
    opacity: 0.5;
  }
  &.selected {
    border: 4px solid rgba(black, 0.05);
    opacity: 1;
  }
}
</style>
