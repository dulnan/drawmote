<template>
  <div v-if="visible" class="absolute brush-toolbar" v-bind:style="toolbarStyle">
    <ul class="brush-toolbar__content list absolute flex" v-bind:style="toolbarContentStyle">
      <li v-for="(tool, index) in tools" class="flex" v-bind:class="{ 'selected': selectedTool === index }">
        {{ tool }}
      </li>
    </ul>
  </div>
</template>

<script>
import { EventBus } from '@/events'

import { RADIUS_MIN, RADIUS_MAX } from '@/settings'

export default {
  name: 'BrushToolbar',

  data () {
    return {
      tools: ['size', 'opacity', 'hardness'],
      selectedTool: 1
    }
  },

  props: {
    visible: {
      type: Boolean,
      default: true
    },
    brush: {
      type: Object,
      default: () => {
        return {}
      }
    },
    lazyRadius: {
      type: Number,
      default: 0
    },
    viewport: {
      type: Object,
      default: () => {
        return {
          width: 0,
          height: 0
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

  watch: {
    coordinates: {
      handler (newCoords) {
      },
      deep: true
    }
  },

  computed: {
    toolbarStyle: function () {
      const translateX = Math.min(Math.max(this.coordinates.x, 240 + 32), this.viewport.width - 240 - 32)
      const translateY = Math.max(Math.min(this.coordinates.y, this.viewport.height - 80 - 32), 160)
      return {
        transform: `translate(${translateX}px, ${translateY}px)`
      }
    },
    toolbarContentStyle: function () {
      let top = `${this.lazyRadius + 16}px`

      if (this.coordinates.y > this.viewport.height - 300) {
        top = top * -1
      }
      return {
        top: top
      }
    }
  },

  methods: {
    updateValue (decrement) {
      const delta = decrement ? -1 : 1

      switch (this.tools[this.selectedTool]) {
        case 'size':
          this.brush.radius = Math.min(Math.max(this.brush.radius + delta, RADIUS_MIN), RADIUS_MAX)
          break
        case 'opacity':
          this.brush.opacity = Math.min(Math.max(this.brush.opacity + delta / 40, 0), 1)
          break
        case 'hardness':
          this.brush.hardness = Math.min(Math.max(this.brush.hardness + delta / 70, 0), 1)
          break
      }
    },

    incrementValue () {
      this.updateValue()
    },

    decrementValue () {
      this.updateValue(true)
    },

    prevTool () {
      this.selectedTool = this.selectedTool === 0 ? (this.tools.length - 1) : this.selectedTool - 1
    },

    nextTool () {
      this.selectedTool = (this.selectedTool + 1) % this.tools.length
    }
  },

  beforeDestroy () {
    EventBus.$off('swipeLeft', this.prevTool)
    EventBus.$off('swipeRight', this.nextTool)
    EventBus.$off('touchUp', this.incrementValue)
    EventBus.$off('touchDown', this.decrementValue)
  },

  created () {
    EventBus.$on('swipeLeft', this.prevTool)
    EventBus.$on('swipeRight', this.nextTool)
    EventBus.$on('touchUp', this.incrementValue)
    EventBus.$on('touchDown', this.decrementValue)
  }
}
</script>

<style lang="scss" scoped>
.brush-toolbar {
  z-index: $index-brush-toolbar;
  width: 1px;
  height: 1px;
  &.appear-enter-active, &.appear-leave-active {
    transition: .5s;
  }
  &.appear-enter, &.appear-leave-to {
    transform: translateY(2rem);
    opacity: 0;
  }
}

.brush-toolbar__content {
  left: -10.5rem;
  width: 21rem;
  height: 1rem;
  li {
    flex: 1;
    flex-direction: column;
    align-items: center;
    opacity: 0.2;
    text-transform: uppercase;
    font-weight: 100;
    font-size: 1rem;
    &.selected {
      opacity: 1;
    }
  }
}

</style>
