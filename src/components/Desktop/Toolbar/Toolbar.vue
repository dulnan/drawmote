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
              :hovered-key="toolBeingHovered" />
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import ToolbarButton from '@/components/Desktop/Toolbar/Button.vue'
import ToolbarButtonColor from '@/components/Desktop/Toolbar/ButtonColor.vue'
import ToolbarButtonClear from '@/components/Desktop/Toolbar/ButtonClear.vue'
import ToolbarSlider from '@/components/Desktop/Toolbar/Slider.vue'
import ToolbarSliderSize from '@/components/Desktop/Toolbar/SliderSize.vue'
import ToolbarSliderOpacity from '@/components/Desktop/Toolbar/SliderOpacity.vue'
import ToolbarSliderHardness from '@/components/Desktop/Toolbar/SliderHardness.vue'

import { COLORS, TOOLBAR_TOOLS, TOOLBAR_SLIDERS } from '@/settings'
import { THREAD_TOOLS } from '@/settings/drawthreads'

import Color from '@/classes/Color'

export default {
  name: 'BrushToolbar',

  components: {
    ToolbarButton,
    ToolbarButtonColor,
    ToolbarButtonClear,
    ToolbarSlider,
    ToolbarSliderSize,
    ToolbarSliderOpacity,
    ToolbarSliderHardness
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
  border-right: 2px dotted $color-greylight;
  background: white;
  z-index: $index-toolbar;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: $toolbar-width;
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
