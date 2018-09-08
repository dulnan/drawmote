<template>
  <div class="toolbar" ref="toolbar">
    <ul class="list toolbar-list">
      <li v-for="group in toolGroups" class="toolbar-group" :class="'toolbar-group--' + group.id" :key="group.id">
        <ul class="list toolbar-group-list flex">
          <li v-for="tool in group.items" :key="group.action + tool.id">
            <component
              ref="items"
              :is="tool.component"
              :tool="tool"
              :group-id="group.id"
              :action="group.action"
              :hovered-key="toolBeingHovered" />
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import ButtonColor from '@/components/Desktop/Toolbar/Button/ButtonColor.vue'
import ButtonClear from '@/components/Desktop/Toolbar/Button/ButtonClear.vue'
import SliderBrushRadius from '@/components/Desktop/Toolbar/Slider/SliderBrushRadius.vue'
import SliderBrushOpacity from '@/components/Desktop/Toolbar/Slider/SliderBrushOpacity.vue'
import SliderBrushHardness from '@/components/Desktop/Toolbar/Slider/SliderBrushHardness.vue'
import SliderLazyRadius from '@/components/Desktop/Toolbar/Slider/SliderLazyRadius.vue'

import { COLORS, TOOLBAR_TOOLS, TOOLBAR_SLIDERS } from '@/settings'
import { THREAD_TOOLS } from '@/settings/drawthreads'

import Color from '@/classes/Color'

export default {
  name: 'BrushToolbar',

  components: {
    ButtonColor,
    ButtonClear,
    SliderBrushRadius,
    SliderBrushOpacity,
    SliderBrushHardness,
    SliderLazyRadius
  },

  draw: [
    {
      threads: [THREAD_TOOLS],
      handler: function (state) {
        let tool = this.getToolAtPoint(state.points.pointer)

        this.toolBeingHovered = tool ? tool.key : ''

        if (tool && state.isPressing) {
          if (this.lastItemClick !== tool.key) {
            tool.el.click()
            this.lastItemClick = tool.key
          }

          const wheel = state.slideY - this.wheelDelta

          if (wheel !== 0) {
            let event = new WheelEvent('wheel', {
              bubbles: false,
              cancelable: true,
              deltaX: 0,
              deltaY: wheel
            })
            tool.el.dispatchEvent(event)
          }

          this.wheelDelta = state.slideY
        } else {
          this.wheelDelta = 0
          this.lastItemClick = ''
        }
      }
    }
  ],

  data () {
    return {
      pointerAreas: [],
      toolBeingHovered: '',
      lastItemClick: '',
      wheelDelta: 0
    }
  },

  computed: {
    toolGroups () {
      return [
        {
          id: 'tools',
          type: 'button',
          action: 'tool',
          items: TOOLBAR_TOOLS
        },
        {
          id: 'colors',
          type: 'button',
          action: 'color',
          items: COLORS.map(color => {
            return {
              id: color.name,
              component: 'ButtonColor',
              color: new Color(color)
            }
          })
        },
        {
          id: 'sliders',
          type: 'slider',
          action: 'brush',
          items: TOOLBAR_SLIDERS
        }
      ]
    }
  },

  methods: {
    getToolAtPoint (point) {
      for (let i = 0; i < this.pointerAreas.length; i++) {
        const area = this.pointerAreas[i]
        if (area.coords.containsPoint(point)) {
          return area
        }
      }
    },
    calculatePointerAreas () {
      let items = []
      this.$refs.items.forEach(item => {
        items.push(item.getRectangle())
      })

      this.pointerAreas = items
    }
  },

  mounted () {
    this.calculatePointerAreas()
  }
}
</script>

<style lang="scss">
.toolbar {
  border-bottom: 2px dotted $alt-color-light;
  background: white;
  z-index: $index-toolbar;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: $toolbar-height;
  overflow: hidden;
}

.toolbar-group {
  flex: 0 0 auto;
}

.toolbar-group--tools {
  border-right: 2px dotted $alt-color-light;
  li:not(:last-child) {
    border-right: 2px dotted $alt-color-light;
  }
}

.toolbar-group--colors {
  padding: 1rem;
  border-right: 2px dotted $alt-color-light;

  li:not(:last-child) {
    margin-right: 1rem;
  }
}

.toolbar-group--sliders {
  padding: 0;
  flex: 1;

  li {
    flex: 1;
    margin-right: 0;
    &:not(:last-child) {
      border-right: 2px dotted $alt-color-light;
    }
  }
}

.toolbar-list {
  display: flex;
}

.toolbar-group-list {
  flex-direction: row;
  position: relative;
  background: white;
  li {
    display: block;
  }
}

</style>
