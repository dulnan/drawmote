<template>
  <div class="absolute overlay drawing">

    <overlay :visible="toolbarVisible"></overlay>

    <toolbar
      :lazy-radius="lazyRadius"
      :brush="brush"
      :touch-y="touchSlidingY"
      :viewport="viewport"
      ref="toolbar"
    />

    <pointer v-if="useLazyBrush" />

    <div class="absolute canvas-container" ref="canvasContainer">
      <brush
        :brush="brush"
        :use-lazy-brush="useLazyBrush"
        :lazy-radius="lazyRadius"
      ></brush>
      <drawing-canvas />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { EventBus } from '@/events'

import { RADIUS_MAX, BRUSH_DEFAULT } from '@/settings'

import { getViewportSize } from '@/tools/helpers.js'

import Brush from '@/components/Brush.vue'
import Overlay from '@/components/Overlay.vue'
import Pointer from '@/components/Desktop/Pointer.vue'
import Toolbar from '@/components/Desktop/Toolbar/Toolbar.vue'
import ColorPicker from '@/components/Desktop/ColorPicker.vue'
import DrawingCanvas from '@/components/Desktop/DrawingCanvas.vue'

// Setting this to true allows movement with mouse and arrow keys
const DEBUG = true

export default {
  name: 'Drawing',

  components: {
    Brush,
    Pointer,
    Toolbar,
    Overlay,
    ColorPicker,
    DrawingCanvas
  },

  data () {
    return {
      viewport: {
        width: 0,
        height: 0,
        ratio: 1
      },
      touchSlidingY: 0,
      brush: BRUSH_DEFAULT,
      useLazyBrush: true,
      toolbarVisible: false,
      brushToolbarVisible: false
    }
  },

  computed: {
    lazyRadius: function () {
      return Math.max(Math.min(this.brush.radius * 2.5, RADIUS_MAX + 20), 15)
    },
    ...mapState('Brush', ['isPressing'])
  },

  methods: {
    loop () {
      if (this.isPressing !== this.$global.isPressing) {
        this.$store.commit('Brush/setIsPressing', this.$global.isPressing)
      }
      window.requestAnimationFrame(() => this.loop())
    },

    getElementSizes () {
      const canvasRect = this.$refs.canvasContainer.getBoundingClientRect()
      const toolbarRect = this.$refs.toolbar.$el.getBoundingClientRect()

      this.$store.commit('App/setCanvasRect', canvasRect)
      this.$store.commit('App/setToolbarRect', toolbarRect)
    }
  },

  mounted () {
    this.loop()
    this.getElementSizes()
  },

  created () {
    this.viewport = getViewportSize()

    // Add event listeners
    EventBus.$on('setBrushColor', (newColor) => {
      this.updateBrushColor(newColor)
      this.toolbarVisible = false
    })

    EventBus.$on('toggleBrushStyle', () => {
      const newStyle = this.brush.style === 'stroke' ? 'smudge' : 'stroke'
      this.updateBrushStyle(newStyle)
    })

    EventBus.$on('updateBrush', (newBrush) => {
      this.updateBrush(newBrush)
    })

    EventBus.$on('OrientationOffset', (data) => {
      this.initialAngles.alpha = data.alpha
      this.initialAngles.beta = data.beta
    })

    EventBus.$on('Orientation', (data) => {

    })

    EventBus.$on('SlideData', (slideData) => {
      this.touchSlidingY = slideData
    })

    // Allow usage with mouse and arrow keys for debugging
    if (DEBUG) {
      document.addEventListener('wheel', (event) => {
        event.preventDefault()

        if (event.deltaY > 0) {
          EventBus.$emit('touchUp')
        } else {
          EventBus.$emit('touchDown')
        }
      })

      document.addEventListener('mousemove', (e) => {
        this.$global.updateFromMouse({
          x: e.clientX,
          y: e.clientY
        })
      })

      document.addEventListener('mousedown', (e) => {
        this.$store.commit('Brush/setIsPressing', true)
      })

      document.addEventListener('mouseup', (e) => {
        this.$store.commit('Brush/setIsPressing', false)
      })
    }
  }
}
</script>

<style lang="scss">
.drawing {
  overflow: hidden;
}

.canvas-container {
  left: $toolbar-width;
  bottom: 0;
  right: 0;
}
</style>
