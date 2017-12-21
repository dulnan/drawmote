<template>
  <div class="relative overlay" ref="drawingApp">
    <toolbar></toolbar>
    <!-- <color-picker></color-picker> -->
    <brush :brush="brush" :lazy-radius="lazyRadius" :coordinates="brushCoordinates"></brush>
    <pointer :coordinates="pointerCoordinates"></pointer>
    <drawing-canvas :viewport="viewport" :color="brush.color.hex" :radius="brush.radius" :coordinates="brushCoordinates" :is-pressing="isPressing"></drawing-canvas>
  </div>
</template>

<script>
import { EventBus } from '@/events'

import { DEFAULT_COLOR, RADIUS_DEFAULT, RADIUS_MIN, RADIUS_MAX } from '@/settings'

import { getPointOnScreen } from '@/tools/GyroTransform.js'
import { getViewportSize, pointOutsideCircle, movePointAtAngle } from '@/tools/helpers.js'

import Brush from '@/components/Brush.vue'
import Pointer from '@/components/Desktop/Pointer.vue'
import Toolbar from '@/components/Desktop/Toolbar.vue'
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
    ColorPicker,
    DrawingCanvas
  },

  sockets: {
    receiveOrientation: function (data) {
      this.inputCoordinates = getPointOnScreen(data.alpha, data.beta, this.viewport.width, this.viewport.height)
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
      mobileOrientation: {
        alpha: 0,
        beta: 0,
        gamma: 0
      },
      pointerCoordinates: {
        x: 0,
        y: 0
      },
      brushCoordinates: {
        x: 0,
        y: 0
      },
      brush: {
        color: DEFAULT_COLOR,
        radius: RADIUS_DEFAULT
      },
      isPressing: false
    }
  },

  computed: {
    lazyRadius: function () {
      return Math.max(Math.min(this.brush.radius * 1.7, RADIUS_MAX + 20), 20)
    }
  },

  created () {
    // Adding this in the created hook prevents it from being reactive,
    // thus not cloggin up ressources because these values can change
    // a lot during movement
    this.inputCoordinates = {
      x: 0,
      y: 0
    }
  },

  methods: {
    loop () {
      // Find the difference of the pointer coordinates to the brush
      const diff = {
        x: this.inputCoordinates.x - this.brushCoordinates.x,
        y: this.inputCoordinates.y - this.brushCoordinates.y
      }

      // The distance between the position of the brush and the pointer,
      // minus the lazyRadius
      const distance = Math.sqrt(diff.x * diff.x + diff.y * diff.y) - this.lazyRadius

      // If the pointer is outside the lazy area, update the position of the brush
      if (pointOutsideCircle(this.inputCoordinates, this.brushCoordinates, this.lazyRadius)) {
        // Use the difference of the pointer to the brush to get the angle in radians
        const angle = Math.atan2(diff.y, diff.x)

        // Update the brush coordinates by moving it by the calculated distance to the pointer
        // and at the right angle.
        this.brushCoordinates = movePointAtAngle(this.brushCoordinates, angle, distance)
      }

      this.pointerCoordinates = this.inputCoordinates
      window.requestAnimationFrame(this.loop)
    },

    updateBrushColor (newColor) {
      this.brush.color = newColor
      this.$socket.emit('sendBrush', this.brush)
    },

    updateBrushRadius (newRadius) {
      this.brush.radius = Math.min(Math.max(newRadius, RADIUS_MIN), RADIUS_MAX)
      this.$socket.emit('sendBrush', this.brush)
    }
  },

  mounted () {
    this.viewport = getViewportSize()

    // Add event listeners
    EventBus.$on('setBrushColor', this.updateBrushColor)
    EventBus.$on('setBrushColor', this.updateBrushColor)

    // Allow usage with mouse and arrow keys for debugging
    if (DEBUG) {
      document.addEventListener('wheel', (event) => {
        if (event.deltaY > 0) {
          this.updateBrushRadius(this.brush.radius - 2)
        } else {
          this.updateBrushRadius(this.brush.radius + 2)
        }
      })

      document.addEventListener('mousemove', (e) => {
        this.inputCoordinates = {
          x: e.clientX,
          y: e.clientY
        }
      })

      document.addEventListener('mousedown', (e) => {
        this.isPressing = true
      })

      document.addEventListener('mouseup', (e) => {
        this.isPressing = false
      })

      window.addEventListener('keydown', (e) => {
        let position = Object.assign({}, this.inputCoordinates)
        if (e.keyCode === 38) {
          position.y = position.y - 1
        } else if (e.keyCode === 40) {
          position.y = position.y + 1
        } else if (e.keyCode === 37) {
          position.x = position.x - 1
        } else if (e.keyCode === 39) {
          position.x = position.x + 1
        }
        this.inputCoordinates = position
      })
    }

    // Start the main animation loop
    this.loop()
  }
}
</script>

<style lang="scss" scoped>
</style>
