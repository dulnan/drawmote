<template>
  <div class="overlay drawing material" ref="drawingApp">

    <overlay :visible="toolbarVisible"></overlay>

    <brush-toolbar
      v-show="!isPressingAside"
      :is-pressing="isPressingAside"
      :lazy-radius="lazyRadius"
      :brush="brush"
      :coordinates="pointerCoordinates"
      :touch-y="touchSlidingY"
      :viewport="viewport"
    ></brush-toolbar>



    <pointer
      v-if="useLazyBrush"
      :coordinates="pointerCoordinates"
    ></pointer>

    <div class="canvas-container">
      <brush
        :brush="brush"
        :use-lazy-brush="useLazyBrush"
        :lazy-radius="lazyRadius"
        :coordinates="brushCoordinates"
      ></brush>
      <drawing-canvas
        :brush="brush"
        :coordinates="brushCoordinates"
        :is-pressing="isPressingMain"
        :use-lazy-brush="useLazyBrush"
      ></drawing-canvas>
    </div>
  </div>
</template>

<script>
import { EventBus } from '@/events'

import { RADIUS_MIN, RADIUS_MAX, BRUSH_DEFAULT, HARDNESS_MIN, HARDNESS_MAX } from '@/settings'

import { GyroTransform } from '@/tools/GyroTransform.js'
import { getViewportSize, pointOutsideCircle, movePointAtAngle, parseDataString } from '@/tools/helpers.js'

import Brush from '@/components/Brush.vue'
import Overlay from '@/components/Overlay.vue'
import Pointer from '@/components/Desktop/Pointer.vue'
import Toolbar from '@/components/Desktop/Toolbar.vue'
import BrushToolbar from '@/components/Desktop/BrushToolbar.vue'
import ColorPicker from '@/components/Desktop/ColorPicker.vue'
import DrawingCanvas from '@/components/Desktop/DrawingCanvas.vue'

// Setting this to true allows movement with mouse and arrow keys
const DEBUG = true

var gyro = {}

export default {
  name: 'Drawing',

  components: {
    Brush,
    Pointer,
    Toolbar,
    BrushToolbar,
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
      pointerCoordinates: {
        x: 0,
        y: 0
      },
      brushCoordinates: {
        x: 0,
        y: 0
      },
      touchSlidingY: 0,
      initialAngles: {
        alpha: null,
        beta: null
      },
      brush: BRUSH_DEFAULT,
      isPressingMain: false,
      isPressingAside: false,
      useLazyBrush: true,
      toolbarVisible: false,
      brushToolbarVisible: false
    }
  },

  computed: {
    lazyRadius: function () {
      return Math.max(Math.min(this.brush.radius * 2.5, RADIUS_MAX + 20), 15)
    },
    canvasCoordinates: function () {
      return {
        x: Math.round(this.brushCoordinates.x),
        y: Math.round(this.brushCoordinates.y)
      }
    }
  },

  watch: {
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
      this.$connection.emit('sendBrush', this.brush)
    },

    updateBrushRadius (newRadius) {
      this.brush.radius = Math.min(Math.max(newRadius, RADIUS_MIN), RADIUS_MAX)
      this.$connection.emit('sendBrush', this.brush)
    },

    updateBrushHardness (newHardness) {
      this.brush.hardness = Math.min(Math.max(newHardness, HARDNESS_MIN), HARDNESS_MAX)
      this.$connection.emit('sendBrush', this.brush)
    },

    updateBrushOpacity (newOpacity) {
      this.brush.opacity = Math.min(Math.max(newOpacity, 0), 1)
      this.$connection.emit('sendBrush', this.brush)
    },

    updateBrushStyle (newStyle) {
      this.brush.style = newStyle
    },

    updateBrush (newBrush) {
      this.brush = newBrush
    }
  },

  created () {
    this.inputCoordinates = {
      x: 0,
      y: 0
    }

    this.viewport = getViewportSize()

    gyro = new GyroTransform(this.viewport.width * 1, this.viewport.width, this.viewport.height)

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
      const dataObj = parseDataString(data)
      const calibratedAlpha = 0 - dataObj.alpha + this.initialAngles.alpha
      const calibratedBeta = dataObj.beta - this.initialAngles.beta

      this.inputCoordinates = gyro.getPointOnScreen(calibratedAlpha, calibratedBeta)

      if (this.isPressingMain !== dataObj.isPressingMain) {
        this.isPressingMain = dataObj.isPressingMain
      }

      if (this.isPressingAside !== dataObj.isPressingAside) {
        this.isPressingAside = dataObj.isPressingAside
      }
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
        this.inputCoordinates = {
          x: e.clientX,
          y: e.clientY
        }
      })

      document.addEventListener('mousedown', (e) => {
        this.isPressingMain = true
      })

      document.addEventListener('mouseup', (e) => {
        this.isPressingMain = false
      })

      window.addEventListener('keydown', (e) => {
        let position = Object.assign({}, this.inputCoordinates)
        // Arrow Up
        if (e.keyCode === 38) {
          if (e.shiftKey) {
            this.toolbarVisible = true
          } else {
            position.y = position.y - 1
          }
        // Arrown Down
        } else if (e.keyCode === 40) {
          if (e.shiftKey) {
            this.toolbarVisible = false
          } else {
            position.y = position.y + 1
          }
        // Arrow Left
        } else if (e.keyCode === 37) {
          if (e.shiftKey) {
            EventBus.$emit('swipeLeft')
          } else {
            position.x = position.x - 1
          }
        // Arrow Right
        } else if (e.keyCode === 39) {
          if (e.shiftKey) {
            EventBus.$emit('swipeRight')
          } else {
            position.x = position.x + 1
          }
        // C
        } else if (e.keyCode === 67) {
          EventBus.$emit('clearCanvas')
        // L
        } else if (e.keyCode === 76) {
          this.useLazyBrush = !this.useLazyBrush
        // S
        } else if (e.keyCode === 83) {
          EventBus.$emit('toggleBrushStyle')
        // B
        } else if (e.keyCode === 66) {
          this.brushToolbarVisible = !this.brushToolbarVisible
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
  display: flex;
  flex-direction: row;
  &.appear-enter-active, &.appear-leave-active {
    transition: .5s;
  }
  &.appear-enter, &.appear-leave-to {
    transform: scale(1.05);
    opacity: 0;
  }
}

.canvas-container {
  flex: 1;
}

.header {
  text-align: left;
  right: 0;
  padding: 0.75rem;
  height: 3rem;
  background: white;
  box-shadow: 0 1px 0 0 rgba($color-black, 0.1);
  z-index: $index-header;
  h1 {
    font-size: 1.25rem;
  }
}
</style>
