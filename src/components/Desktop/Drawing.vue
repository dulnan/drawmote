<template>
  <div class="drawing">
    <toolbar ref="toolbar" />
    <div class="drawing-area" ref="canvasContainer"></div>
    <canvas-drawing />
    <canvas-interface />

  </div>
</template>

<script>
import { EventBus } from '@/events'

import Toolbar from '@/components/Desktop/Toolbar/Toolbar.vue'
import CanvasDrawing from '@/components/Desktop/Canvas/CanvasDrawing.vue'
import CanvasInterface from '@/components/Desktop/Canvas/CanvasInterface.vue'

// Setting this to true allows movement with mouse and arrow keys
const DEBUG = true

export default {
  name: 'Drawing',

  components: {
    Toolbar,
    CanvasDrawing,
    CanvasInterface
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.drawing-area {
  position: absolute;
  top: $toolbar-height;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
