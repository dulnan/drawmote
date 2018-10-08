<template>
  <div class="drawing">
    <toolbar ref="toolbar" />
    <div class="drawing-area" ref="canvasContainer" :style="drawingAreaStyle"></div>
    <canvas-drawing />
    <canvas-interface />
  </div>
</template>

<script>
import { THREAD_SIZES } from '@/settings/drawthreads'

import Toolbar from '@/components/Desktop/Toolbar/Toolbar.vue'
import CanvasDrawing from '@/components/Desktop/Canvas/CanvasDrawing.vue'
import CanvasInterface from '@/components/Desktop/Canvas/CanvasInterface.vue'

import PointerEvents from '@/mixins/PointerEvents.js'

export default {
  name: 'Drawing',

  mixins: [
    PointerEvents
  ],

  components: {
    Toolbar,
    CanvasDrawing,
    CanvasInterface
  },

  data () {
    return {
      toolbarHeight: 0
    }
  },

  computed: {
    drawingAreaStyle () {
      return {
        top: `${this.toolbarHeight}px`
      }
    }
  },

  draw: [
    {
      threads: [THREAD_SIZES],
      handler: function (state) {
        this.getElementSizes()
      }
    }
  ],

  methods: {
    getElementSizes () {
      if (this.$refs.canvasContainer) {
        const canvasRect = this.$refs.canvasContainer.getBoundingClientRect()
        this.$global.updateCanvasRect(canvasRect)
      }

      if (this.$refs.toolbar) {
        const toolbarRect = this.$refs.toolbar.$el.getBoundingClientRect()
        this.$global.updateToolbarRect(toolbarRect)
        this.toolbarHeight = toolbarRect.height
      }
    }
  },

  mounted () {
    this.getElementSizes()
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
  background: white;
}

.drawing-area {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
