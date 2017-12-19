<template>
  <div class="relative overlay">
    <toolbar @setBrushColor="updateBrushColor"></toolbar>
    <brush :brush="brush" :coordinates="brushCoordinates"></brush>
    <pointer :coordinates="pointerCoordinates"></pointer>
    <drawing-canvas :viewport="viewport" :color="brush.color.hex" :radius="brush.radius" :coordinates="brushCoordinates" :is-pressing="isPressing"></drawing-canvas>
  </div>
</template>

<script>
import { DEFAULT_COLOR, DEFAULT_RADIUS } from '@/settings'

import { getPointOnScreen } from '@/tools/GyroTransform.js'
import { getViewportSize, pointOutsideCircle } from '@/tools/helpers.js'

import Brush from '@/components/Brush.vue'
import Pointer from '@/components/Desktop/Pointer.vue'
import Toolbar from '@/components/Desktop/Toolbar.vue'
import DrawingCanvas from '@/components/Desktop/DrawingCanvas.vue'

export default {
  name: 'Drawing',

  components: {
    Brush,
    Pointer,
    Toolbar,
    DrawingCanvas
  },

  sockets: {
    receiveOrientation: function (data) {
      this.pointerCoordinates = getPointOnScreen(data.alpha, data.beta, this.viewport.width, this.viewport.height)
      this.isPressing = data.isPressing
    }
  },

  data () {
    return {
      viewport: {
        width: 0,
        height: 0,
        ratio: 1
      },
      pointerCoordinates: {
        x: 0,
        y: 0
      },
      prevPointerCoordinates: {
        x: 0,
        y: 0
      },
      brushCoordinates: {
        x: 0,
        y: 0
      },
      brush: {
        color: DEFAULT_COLOR,
        radius: DEFAULT_RADIUS
      },
      isPressing: false
    }
  },

  methods: {
    loop () {
      let velocity = 15 - (Math.abs(this.pointerCoordinates.x - this.prevPointerCoordinates.x) + Math.abs(this.pointerCoordinates.y - this.prevPointerCoordinates.y)) / 5
      velocity = Math.max(velocity, 3)
      if (pointOutsideCircle(this.pointerCoordinates, this.brushCoordinates, this.brush.radius)) {
        this.brushCoordinates = {
          x: Math.round(this.brushCoordinates.x + ((this.pointerCoordinates.x - this.brushCoordinates.x) / velocity)),
          y: Math.round(this.brushCoordinates.y + ((this.pointerCoordinates.y - this.brushCoordinates.y) / velocity))
        }
      }

      this.prevPointerCoordinates = this.pointerCoordinates

      window.requestAnimationFrame(this.loop)
    },
    updateBrushColor (newColor) {
      this.brush.color = newColor
      this.sendBrush()
    },

    sendBrush () {
      this.$socket.emit('sendBrush', this.brush)
    }
  },

  mounted () {
    this.viewport = getViewportSize()

    this.loop()
  }
}
</script>

<style lang="scss" scoped>
.app-drawing {
}
</style>
