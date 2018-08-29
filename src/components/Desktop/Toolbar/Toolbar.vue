<template>
  <div class="toolbar relative" ref="toolbar">
    <ul class="list list--divided">
      <li v-for="group in toolGroups" :class="{ 'pdg': group.type !== 'slider' }">
        <ul class="list toolbar-list flex">
          <li v-for="tool in group.items" :class="'toolbar-list__item--' + group.type">
            <component
              ref="items"
              :is="tool.component"
              :tool="tool"
              :action="group.action"
              :hovered-key="itemBeingHovered" />
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { EventBus } from '@/events'

import ToolbarButton from '@/components/Desktop/Toolbar/Button.vue'
import ToolbarButtonColor from '@/components/Desktop/Toolbar/ButtonColor.vue'
import ToolbarSlider from '@/components/Desktop/Toolbar/Slider.vue'
import ToolbarSliderSize from '@/components/Desktop/Toolbar/SliderSize.vue'
import ToolbarSliderOpacity from '@/components/Desktop/Toolbar/SliderOpacity.vue'
import ToolbarSliderHardness from '@/components/Desktop/Toolbar/SliderHardness.vue'

import { COLORS, TOOLBAR_TOOLS, TOOLBAR_SLIDERS } from '@/settings'
import { THREAD_TOOLS, THREAD_BRUSH } from '@/settings/drawthreads'

import { pointIsInRectangle } from '@/tools/helpers.js'

import Color from '@/classes/Color'

export default {
  name: 'BrushToolbar',

  components: {
    ToolbarButton,
    ToolbarButtonColor,
    ToolbarSlider,
    ToolbarSliderSize,
    ToolbarSliderOpacity,
    ToolbarSliderHardness
  },

  draw: [
    {
      threads: [THREAD_BRUSH],
      handler: function (state) {
        this.activeColor = state.brush.color
      }
    },
    {
      threads: [THREAD_TOOLS],
      handler: function (state) {
        let itemBeingHovered = ''

        this.pointerAreas.forEach(area => {
          if (area.coords.containsPoint(state.points.pointer)) {
            itemBeingHovered = area.key
          }
        })

        this.itemBeingHovered = itemBeingHovered

        if (itemBeingHovered && state.isPressing) {
          EventBus.$emit('pointerOver_' + itemBeingHovered, state)
        }
      }
    }
  ],

  data () {
    return {
      initialValueSet: false,
      pointerAreas: [],
      itemBeingHovered: '',
      activeColor: ''
    }
  },

  computed: {
    toolGroups () {
      return [
        {
          type: 'button',
          action: 'tool',
          items: TOOLBAR_TOOLS
        },

        {
          type: 'slider',
          action: 'brush',
          items: TOOLBAR_SLIDERS
        },

        {
          type: 'button',
          action: 'color',
          items: COLORS.map(color => {
            return {
              id: color.name,
              component: 'ToolbarButtonColor',
              color: new Color(color)
            }
          })
        }
      ]
    }
  },

  methods: {
    calculatePointerAreas () {
      let items = []
      this.$refs.items.forEach(item => {
        items.push(item.getRectangle())
      })

      this.pointerAreas = items
    },

    pointerLoop () {
      let areaFound = false

      const isHoveringToolbar = pointIsInRectangle(this.$global.pointerCoordinates, this.toolbarArea)

      if (isHoveringToolbar !== this.isHoveringToolbar) {
        this.$store.commit('App/setIsHoveringToolbar', isHoveringToolbar)
      }

      if (isHoveringToolbar) {
        this.pointerAreas.forEach(area => {
          if (pointIsInRectangle(this.$global.pointerCoordinates, area.coords)) {
            this.itemBeingHovered = area.key
            areaFound = true
          }
        })
      }

      if (!areaFound) {
        this.itemBeingHovered = ''
      }

      window.requestAnimationFrame(() => this.pointerLoop())
    }
  },

  mounted () {
    this.calculatePointerAreas()
  }
}
</script>

<style lang="scss">
.toolbar {
  border-right: 2px dotted $color-greylight;
  background: white;
  z-index: 1000;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: $toolbar-width;
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
  position: relative;
  background: white;
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
  margin: 0 !important;
}

</style>