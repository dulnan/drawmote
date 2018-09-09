<template>
  <div class="toolbar bg-white" ref="toolbar">
    <ul class="list-inline list-inline--tight list-inline--divided toolbar-list flex--align-stretch">
      <li
        v-for="group in toolGroups"
        :key="group.id"
        class="toolbar-group flex"
        :class="[
          'toolbar-group--' + group.id,
          { 'flex-1': group.id === 'sliders' }
        ]" >
        <ul
          class="list-inline toolbar-group-list"
          :class="{
            'list-inline--tight': group.id !== 'colors',
            'list-inline--small pdgh': group.id === 'colors',
            'flex-1 list-inline--divided': group.id === 'sliders',
          }"
        >
          <li
            v-for="tool in group.items"
            :key="group.action + tool.id"
            :class="{ 'flex-1': group.id === 'sliders' }"
          >
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
  border-bottom: $list-separator-style;
  z-index: $index-toolbar;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: $toolbar-height;
  overflow: hidden;
}

.toolbar-group-list {
  position: relative;
}

</style>
