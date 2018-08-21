<template>
  <div class="absolute overlay drawing">
    <toolbar ref="toolbar" />
    <div class="absolute drawing-area" ref="canvasContainer"></div>
    <drawing-canvas />
    <interface-canvas />

  </div>
</template>

<script>
import { EventBus } from '@/events'

import Toolbar from '@/components/Desktop/Toolbar/Toolbar.vue'
import DrawingCanvas from '@/components/Desktop/DrawingCanvas.vue'
import InterfaceCanvas from '@/components/Desktop/InterfaceCanvas.vue'

// Setting this to true allows movement with mouse and arrow keys
const DEBUG = true

export default {
  name: 'Drawing',

  components: {
    Toolbar,
    DrawingCanvas,
    InterfaceCanvas
  },

  methods: {
    getElementSizes () {
      if (this.$refs.canvasContainer) {
        const canvasRect = this.$refs.canvasContainer.getBoundingClientRect()
        this.$global.updateCanvasRect(canvasRect)
      }

      if (this.$refs.toolbar) {
        const toolbarRect = this.$refs.toolbar.$el.getBoundingClientRect()
        this.$global.updateToolbarRect(toolbarRect)
      }
    }
  },

  mounted () {
    this.getElementSizes()
  },

  created () {
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

      document.addEventListener('mousedown', () => {
        this.$global.updateIsPressing(true)
      })

      document.addEventListener('mouseup', (e) => {
        this.$global.updateIsPressing(false)
      })
    }
  }
}
</script>

<style lang="scss">
.drawing {
  overflow: hidden;
}

.drawing-area {
  left: $toolbar-width;
  bottom: 0;
  right: 0;
}
</style>
