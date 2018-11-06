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
          class="list-inline list-inline--tight toolbar-group-list flex--align-stretch"
          :class="{
            'flex-1 list-inline--divided': group.id === 'sliders',
          }"
        >
          <li
            class="flex flex--align-stretch"
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
import ButtonClear from '@/components/Desktop/Toolbar/Button/ButtonClear.vue'
import ButtonUndo from '@/components/Desktop/Toolbar/Button/ButtonUndo.vue'
import ButtonRedo from '@/components/Desktop/Toolbar/Button/ButtonRedo.vue'

import ButtonColor from '@/components/Desktop/Toolbar/Button/ButtonColor.vue'

import SliderBrushRadius from '@/components/Desktop/Toolbar/Slider/SliderBrushRadius.vue'
import SliderBrushOpacity from '@/components/Desktop/Toolbar/Slider/SliderBrushOpacity.vue'
import SliderBrushHardness from '@/components/Desktop/Toolbar/Slider/SliderBrushHardness.vue'
import SliderLazyRadius from '@/components/Desktop/Toolbar/Slider/SliderLazyRadius.vue'
import SliderDistance from '@/components/Desktop/Toolbar/Slider/SliderDistance.vue'

import { COLORS, TOOLBAR_TOOLS, TOOLBAR_SLIDERS } from '@/settings'
import threads from '@/store/threads'

import Color from '@/classes/Color'

export default {
  name: 'BrushToolbar',

  components: {
    ButtonColor,
    ButtonClear,
    ButtonUndo,
    ButtonRedo,
    SliderBrushRadius,
    SliderBrushOpacity,
    SliderBrushHardness,
    SliderLazyRadius,
    SliderDistance
  },

  vuetamin: {
    calculatePointerAreas: [threads.SIZES],
    handleToolsChange: [threads.TOOLS],
    handleConnection: threads.CONNECTION
  },

  data () {
    return {
      pointerAreas: [],
      toolBeingHovered: '',
      lastItemClick: '',
      wasPressingBefore: false,
      wheelDelta: 0,
      canvasFilterSupported: false,
      connectionDevice: ''
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
          items: TOOLBAR_SLIDERS.filter(tool => {
            if (tool.id === 'brushHardness' && !this.canvasFilterSupported) {
              return false
            }

            if (tool.id === 'distance' && this.connectionDevice !== 'phone') {
              return false
            }

            return true
          })
        }
      ]
    }
  },

  methods: {
    handleConnection ({ connection }) {
      this.connectionDevice = connection.device
    },

    handleToolsChange (state) {
      let tool = this.getToolAtPoint(state.points.pointer)

      this.toolBeingHovered = tool ? tool.key : ''

      if (tool && state.isPressing) {
        if (this.lastItemClick !== this.toolBeingHovered && !this.wasPressingBefore) {
          tool.el.click()
          this.lastItemClick = tool.key
        }

        const wheel = state.slideY - this.wheelDelta

        if (wheel !== 0) {
          let event = new WheelEvent('wheel', {
            bubbles: false,
            cancelable: true,
            deltaX: 0,
            deltaY: wheel / 2
          })
          tool.el.dispatchEvent(event)
        }

        this.wheelDelta = state.slideY
      } else {
        this.wheelDelta = 0
        this.lastItemClick = ''
      }

      this.wasPressingBefore = state.isPressing
    },

    getToolAtPoint (point) {
      for (let i = 0; i < this.pointerAreas.length; i++) {
        const area = this.pointerAreas[i]
        if (area.coords.containsPoint(point)) {
          return area
        }
      }
    },
    calculatePointerAreas () {
      this.canvasFilterSupported = this.$vuetamin.store.data.canvasFilterSupported

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
  height: $toolbar-height - 1rem;
  // overflow: hidden;
  user-select: none;
  @include media('md') {
    height: $toolbar-height;
  }
}

.toolbar-list {
  height: 100%;
}

.toolbar-group-list {
  position: relative;
}

.toolbar-group--colors {
  li {
    @include media('sm') {
      margin-right: 0.125rem;
    }
    @include media('md') {
      margin-right: 0.25rem;
    }
    @include media('lg') {
      margin-right: 0.5rem;
    }
    &:first-child {
      @include media('sm') {
        margin-left: rem(7px);
      }
      @include media('md') {
        margin-left: rem(10px);
      }
      @include media('lg') {
        margin-left: rem(13px);
      }
    }
    &:last-child {
      @include media('sm') {
        margin-right: rem(7px);
      }
      @include media('md') {
        margin-right: rem(10px);
      }
      @include media('lg') {
        margin-right: rem(13px);
      }
    }
  }
}

.toolbar-group--sliders {
  li {
    max-width: 18rem;
  }
}
</style>
