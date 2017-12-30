<template>
  <div class="relative overlay drawing" ref="drawingApp">
    <div class="absolute header">
      <h1>drawmote</h1>
    </div>
    <toolbar :visible="toolbarVisible" :selected-color="brush.color" :coords-x="pointerCoordinates.x" :width="viewport.width"></toolbar>
    <!-- <color-picker></color-picker> -->
    <brush :brush="brush" :use-lazy-brush="useLazyBrush" :lazy-radius="lazyRadius" :coordinates="brushCoordinates"></brush>
    <pointer v-if="useLazyBrush" :coordinates="pointerCoordinates"></pointer>
    <drawing-canvas :brush="brush" :viewport="viewport" :coordinates="brushCoordinates" :is-pressing="isPressing" :use-lazy-brush="useLazyBrush"></drawing-canvas>
  </div>
</template>

<script>
import { EventBus } from '@/events'

import { RADIUS_MIN, RADIUS_MAX, BRUSH_DEFAULT, HARDNESS_MIN, HARDNESS_MAX } from '@/settings'

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
      if (this.isPressing !== data.isPressing) {
        this.isPressing = data.isPressing
      }
    },
    receiveSwipe: function (direction) {
      switch (direction) {
        case 'up':
          this.toolbarVisible = true
          break
        case 'down':
          this.toolbarVisible = false
          break
      }
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
      brush: BRUSH_DEFAULT,
      isPressing: false,
      useLazyBrush: true,
      toolbarVisible: false
    }
  },

  computed: {
    lazyRadius: function () {
      return Math.max(Math.min(this.brush.radius * 2.25, RADIUS_MAX + 20), 15)
    },
    canvasCoordinates: function () {
      return {
        x: Math.round(this.brushCoordinates.x),
        y: Math.round(this.brushCoordinates.y)
      }
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
      if (this.useLazyBrush) {
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
      } else {
        this.brushCoordinates = this.inputCoordinates
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
    },

    updateBrushHardness (newHardness) {
      this.brush.hardness = Math.min(Math.max(newHardness, HARDNESS_MIN), HARDNESS_MAX)
      this.$socket.emit('sendBrush', this.brush)
    },

    updateBrushOpacity (newOpacity) {
      this.brush.opacity = Math.min(Math.max(newOpacity, 0), 1)
      this.$socket.emit('sendBrush', this.brush)
    },

    updateBrushStyle (newStyle) {
      this.brush.style = newStyle
    }
  },

  mounted () {
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

    // Allow usage with mouse and arrow keys for debugging
    if (DEBUG) {
      document.addEventListener('wheel', (event) => {
        event.preventDefault()

        if (event.deltaY > 0) {
          if (event.ctrlKey) {
            this.updateBrushHardness(this.brush.hardness - 0.03)
          } else if (event.altKey) {
            this.updateBrushOpacity(this.brush.opacity - 0.03)
          } else {
            this.updateBrushRadius(this.brush.radius - 0.6)
          }
        } else {
          if (event.ctrlKey) {
            this.updateBrushHardness(this.brush.hardness + 0.03)
          } else if (event.altKey) {
            this.updateBrushOpacity(this.brush.opacity + 0.03)
          } else {
            this.updateBrushRadius(this.brush.radius + 0.6)
          }
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
        console.log(e.keyCode)
        let position = Object.assign({}, this.inputCoordinates)
        if (e.keyCode === 38) {
          if (e.shiftKey) {
            this.toolbarVisible = true
          } else {
            position.y = position.y - 1
          }
        } else if (e.keyCode === 40) {
          if (e.shiftKey) {
            this.toolbarVisible = false
          } else {
            position.y = position.y + 1
          }
        } else if (e.keyCode === 37) {
          if (e.shiftKey) {
            EventBus.$emit('swipeLeft')
          } else {
            position.x = position.x - 1
          }
        } else if (e.keyCode === 39) {
          if (e.shiftKey) {
            EventBus.$emit('swipeRight')
          } else {
            position.x = position.x + 1
          }
        // D
        } else if (e.keyCode === 67) {
          EventBus.$emit('clearCanvas')
        } else if (e.keyCode === 76) {
          this.useLazyBrush = !this.useLazyBrush
        } else if (e.keyCode === 83) {
          EventBus.$emit('toggleBrushStyle')
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
.drawing {
  &.appear-enter-active, &.appear-leave-active {
    transition: .5s;
  }
  &.appear-enter, &.appear-leave-to {
    transform: scale(1.05);
    opacity: 0;
  }
}

.header {
  text-align: left;
  right: 0;
  padding: 0.75rem;
  background: rgba(white, 0.8);
  box-shadow: 0 1px 0 0 rgba($color-black, 0.1);
  z-index: $index-header;
  h1 {
    font-size: 1.25rem;
  }
}
</style>
