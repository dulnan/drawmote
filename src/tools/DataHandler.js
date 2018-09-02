import { GyroPlane } from 'gyro-plane'
import { LazyBrush } from 'lazy-brush'

import Brush from '@/classes/Brush'
import Threads from '@/classes/Threads'
import Rectangle from '@/classes/Rectangle'

import {
  THREAD_POINT,
  THREAD_BRUSH,
  THREAD_STATE,
  THREAD_TOOLS,
  THREAD_BRUSH_RADIUS,
  THREAD_BRUSH_HARDNESS,
  THREAD_BRUSH_OPACITY
} from '@/settings/drawthreads'

export default class DataHandler {
  constructor () {
    this.gyro = {}

    this.lazyBrush = new LazyBrush({
      radius: 80
    })

    this.lazyPointer = new LazyBrush({
      radius: 2,
      enabled: true
    })

    this.brush = new Brush()
    this.threads = new Threads()

    this.isPressing = false
    this.slideY = 0

    this.viewport = {
      width: 1280,
      height: 900,
      ratio: 1
    }

    this.canvasRect = new Rectangle(0, 0, 0, 0)
    this.toolbarRect = new Rectangle(0, 0, 0, 0)

    this.pointingAtToolbar = false
  }

  get state () {
    return {
      brush: this.brush,
      isPressing: this.isPressing,
      lazyRadius: this.lazyBrush.radius,
      sizes: {
        viewport: this.viewport,
        canvasRect: this.canvasRect
      },
      points: {
        brush: this.lazyBrush.brush.toObject(),
        pointer: this.lazyBrush.pointer.toObject()
      },
      slideY: this.slideY,
      pointingAtToolbar: this.pointingAtToolbar
    }
  }

  init () {
    this.gyro = new GyroPlane({
      width: this.viewport.width,
      height: this.viewport.height
    })

    this.threads.trigger(THREAD_BRUSH)
    this.loop()
  }

  loop () {
    this.threads.step(this.state, () => {
      window.requestAnimationFrame(() => this.loop())
    })
  }

  updatePointer (coordinates) {
    const hasChanged = this.lazyBrush.update(coordinates)

    if (hasChanged) {
      this.threads.trigger(THREAD_POINT)
      if (this.toolbarRect.containsPoint(this.lazyBrush.pointer) && (!this.isPressing || this.pointingAtToolbar)) {
        this.pointingAtToolbar = true
        this.threads.trigger(THREAD_TOOLS)
      } else {
        if (this.pointingAtToolbar) {
          this.threads.trigger(THREAD_TOOLS)
        }
        if (!this.isPressing) {
          this.pointingAtToolbar = false
        }
      }
    }
  }

  updateFromRemote (data) {
    this.gyro.updateOrientation(data)

    const coordinates = this.gyro.getScreenCoordinates()

    const hasChanged = this.lazyPointer.update(coordinates)

    if (hasChanged) {
      this.updatePointer(this.lazyPointer.brush)
      this.updateIsPressing(data.isPressingMain)
      this.updateSlideY(data.touchDiffY)
    }
  }

  addHandler (event, uid, context) {
    this.threads.addHandler(event, uid, context)
  }

  removeHandler (event, uid) {
    this.threads.removeHandler(event, uid)
  }

  updateFromMouse (coordinates) {
    this.updatePointer(coordinates)
  }

  updateIsPressing (isPressing) {
    if (this.isPressing !== isPressing) {
      this.isPressing = isPressing
      this.threads.trigger(THREAD_POINT)
      this.threads.trigger(THREAD_TOOLS)
    }
  }

  updateSlideY (slideY) {
    if (this.slideY !== slideY && this.pointingAtToolbar) {
      this.slideY = slideY
      this.threads.trigger(THREAD_POINT)
    }
  }

  updateCalibrationOffset (angle) {
    this.gyro.updateOffset(angle)
  }

  updateCanvasRect (rect) {
    this.canvasRect.setFromDOMRect(rect)
    this.threads.trigger(THREAD_STATE)
  }

  updateToolbarRect (rect) {
    this.toolbarRect.setFromDOMRect(rect)
    this.threads.trigger(THREAD_STATE)
  }

  updateViewport (viewport) {
    this.viewport = viewport
    this.gyro.setScreenDimensions(viewport)
    this.threads.trigger(THREAD_STATE)
  }

  updateUseLazyBrush (useLazyBrush) {
    if (useLazyBrush) {
      this.lazyBrush.enable()
    } else {
      this.lazyBrush.disable()
    }
  }

  updateLazyRadius (radius) {
    // this.lazyBrush.setRadius(radius)
  }

  updateBrushColor (color) {
    this.brush.setColor(color)
    this.threads.trigger(THREAD_BRUSH)
  }

  updateBrushOpacity (opacity) {
    this.brush.setOpacity(opacity)
    this.threads.trigger(THREAD_BRUSH)
    this.threads.trigger(THREAD_BRUSH_OPACITY)
  }

  updateBrushRadius (radius) {
    this.brush.setRadius(radius)
    this.threads.trigger(THREAD_BRUSH)
    this.threads.trigger(THREAD_BRUSH_RADIUS)
  }

  updateBrushHardness (hardness) {
    this.brush.setHardness(hardness)
    this.threads.trigger(THREAD_BRUSH)
    this.threads.trigger(THREAD_BRUSH_HARDNESS)
  }
}
