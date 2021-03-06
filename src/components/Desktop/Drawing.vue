<template>
  <div class="drawing" :class="{ 'is-drawing': isDrawing }">
    <Toolbar v-if="showToolbar" ref="toolbar" />
    <div
      ref="canvasContainer"
      class="drawing-area"
      :style="drawingAreaStyle"
    ></div>
    <CanvasDrawing />
    <CanvasInterface />
    <resize-observer @notify="getElementSizes" />
  </div>
</template>

<script>
import threads from '@/store/vuetamin/threads'

import Toolbar from '@/components/Desktop/Toolbar/Toolbar.vue'
import CanvasDrawing from '@/components/Desktop/Canvas/CanvasDrawing.vue'
import CanvasInterface from '@/components/Desktop/Canvas/CanvasInterface.vue'

import PointerEvents from '@/mixins/PointerEvents.js'

export default {
  name: 'Drawing',

  components: {
    Toolbar,
    CanvasDrawing,
    CanvasInterface
  },

  mixins: [PointerEvents],

  props: {
    showToolbar: {
      type: Boolean,
      default: true
    },
    isDrawing: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      toolbarHeight: 0
    }
  },

  computed: {
    drawingAreaStyle() {
      return {
        top: `${this.toolbarHeight}px`
      }
    }
  },

  vuetamin: {
    getElementSizes: [threads.SIZES]
  },

  mounted() {
    this.getElementSizes()

    if (this.$mote.on) {
      this.$mote.on('pointermove', this.handlePointerMove)
      this.$mote.on('pointerdown', this.handlePointerDown)
      this.$mote.on('pointerup', this.handlePointerUp)
      this.$mote.on('touch', this.handleTouch)
      this.$mote.on('calibrated', this.handleCalibrated)
    }
  },

  beforeDestroy() {
    if (this.$mote.on) {
      this.$mote.off('pointermove', this.handlePointerMove)
      this.$mote.off('pointerdown', this.handlePointerDown)
      this.$mote.off('pointerup', this.handlePointerUp)
      this.$mote.off('touch', this.handleTouch)
      this.$mote.off('calibrated', this.handleCalibrated)
    }
  },

  methods: {
    getElementSizes() {
      if (this.$refs.canvasContainer) {
        const canvasContainer = this.$refs.canvasContainer
        this.$vuetamin.store.mutate('updateCanvasRect', canvasContainer)
      }

      if (this.$refs.toolbar) {
        const toolbar = this.$refs.toolbar.$el
        this.$vuetamin.store.mutate('updateToolbarRect', toolbar)
        this.toolbarHeight = toolbar.offsetHeight
      }
    },

    handlePointerMove(coordinates) {
      this.$vuetamin.store.mutate('updatePointer', { coordinates })
    },

    handlePointerDown() {
      this.$vuetamin.store.mutate('updateIsPressing', { isPressing: true })
    },

    handlePointerUp() {
      this.$vuetamin.store.mutate('updateIsPressing', { isPressing: false })
    },

    handleTouch(touch) {
      this.$vuetamin.store.mutate('updateTouch', touch)
    },

    handleCalibrated() {
      this.$vuetamin.store.mutate('updateCalibration')
    }
  }
}
</script>

<style lang="scss">
.drawing {
  overflow: hidden;
  position: absolute;
  user-select: none;
  z-index: $index-drawing;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: $alt-color-darker;
  &.component-fade-enter-active,
  &.component-fade-leave-active {
    transition: 1.5s;
  }
  &.component-fade-enter,
  &.component-fade-leave-to {
    transform: scale(1.2);
    opacity: 0;
  }
}

.drawing-area {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
