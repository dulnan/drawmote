<template>
  <div class="toolbar relative">
    <ul class="list list--divided">
      <li v-for="group in toolGroups" :class="{ 'pdg': group.type !== 'slider' }">
        <ul class="list toolbar-list flex">
          <li v-for="tool in group.items" :class="'toolbar-list__item--' + group.type">
            <component
              ref="items"
              :is="group.component"
              :tool="tool"
              :action="group.action"
              :hovered-key="pointerAreaHovered" />
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
/* import { EventBus } from '@/events' */

import BrushToolbarTool from '@/components/Desktop/BrushToolbarTool.vue'
import BrushToolbarSlider from '@/components/Desktop/BrushToolbarSlider.vue'

import { RADIUS_MIN, RADIUS_MAX, COLORS, TOOLBAR_TOOLS, TOOLBAR_SLIDERS } from '@/settings'
import { pointIsInRectangle } from '@/tools/helpers.js'

export default {
  name: 'BrushToolbar',

  components: {
    BrushToolbarTool,
    BrushToolbarSlider
  },

  data () {
    return {
      selectedTool: 1,
      initialToolValue: 0,
      initialValueSet: false,
      startY: 0,
      pointerAreas: [],
      pointerAreaHovered: ''
    }
  },

  computed: {
    toolGroups () {
      return [
        {
          component: 'BrushToolbarTool',
          type: 'button',
          action: 'tool',
          items: TOOLBAR_TOOLS
        },

        {
          component: 'BrushToolbarSlider',
          type: 'slider',
          action: 'brush',
          items: TOOLBAR_SLIDERS
        },

        {
          component: 'BrushToolbarTool',
          type: 'button',
          action: 'color',
          items: COLORS.map(color => {
            return {
              id: color.name,
              background: color.rgb
            }
          })
        }
      ]
    }
  },

  props: {
    isPressing: {
      type: Boolean,
      default: false
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
    },
    touchY: {
      type: Number,
      default: 0
    },
    useLazyBrush: {
      type: Boolean,
      default: true
    }
  },

  watch: {
    touchY (y) {
      this.updateValue(y)
    },

    isPressing (isPressing) {
      if (isPressing) {
        this.initialValueSet = false
      }
    },
    pointerAreaHovered (areaNew, areaBefore) {
      console.log(areaNew)
    }
  },

  methods: {
    updateValue (offset) {
      switch (this.tools[this.selectedTool]) {
        case 'size':
          if (!this.initialValueSet) {
            this.initialToolValue = this.brush.radius
            this.initialValueSet = true
          }
          this.brush.radius = Math.min(Math.max(this.initialToolValue + (offset / 5), RADIUS_MIN), RADIUS_MAX)
          break
        case 'opacity':
          if (!this.initialValueSet) {
            this.initialToolValue = this.brush.opacity
            this.initialValueSet = true
          }
          this.brush.opacity = Math.min(Math.max(this.initialToolValue + offset / 100, 0), 1)
          break
        case 'hardness':
          if (!this.initialValueSet) {
            this.initialToolValue = this.brush.hardness
            this.initialValueSet = true
          }
          this.brush.hardness = Math.min(Math.max(this.initialToolValue + offset / 100, 0), 1)
          break
      }
    },

    incrementValue () {
      this.updateValue()
    },

    decrementValue () {
      this.updateValue(true)
    },

    calculatePointerAreas () {
      let items = []
      this.$refs.items.forEach(item => {
        items.push(item.getRectangle())
      })

      this.pointerAreas = items
    },

    pointerLoop () {
      let areaFound = false

      this.pointerAreas.forEach(area => {
        if (pointIsInRectangle(this.coordinates, area.coords)) {
          this.pointerAreaHovered = area.key
          areaFound = true
        }
      })

      if (!areaFound) {
        this.pointerAreaHovered = ''
      }

      window.requestAnimationFrame(this.pointerLoop)
    }
  },

  beforeDestroy () {
  },

  mounted () {
    this.calculatePointerAreas()
    this.pointerLoop()
  },

  created () {
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  border-right: 2px dotted $color-greylight;
  background: white;
  z-index: 1000;
  width: 8.5rem;
  box-sizing: content-box;
}

.toolbar-dropdown {
  flex-direction: row;
  background: white;
}

.tool-slider {
  text-align: left;
  transition: 0.15s transform;

  &.hover {
    background: $color-greylighter;
    box-shadow: 0 0 0 1px rgba($color-greydark, 0.5);
  }
}



.tool-slider__slider {
  background: $color-greylight;
  height: 0.25rem;
  width: 100%;
  position: relative;
}

.tool-slider__knob {
  position: absolute;
  top: -5px;
  left: 0;
  height: 0.75rem;
  width: 0.75rem;
  background: $color-greydark;
  border-radius: 100%;
}

.toolbar-list {
  flex-wrap: wrap;
  li {
    display: block;
    &:nth-child(n+3) {
      margin-top: 0.5rem;
    }
    &:nth-child(odd) {
      margin-right: 0.5rem;
    }
  }
}

.toolbar-list__item--slider {
  flex: 0 0 100%;
}

</style>
