import { GyroTransform } from '@/tools/GyroTransform.js'
import { LazyBrush } from 'lazy-brush'

import Brush from '@/classes/Brush'
import Threads from '@/classes/Threads'
import Rectangle from '@/classes/Rectangle'

import { THREAD_SLIDE, THREAD_POINT, THREAD_BRUSH, THREAD_STATE, THREAD_TOOLS } from '@/settings/drawthreads'

export default class DataHandler {
  constructor () {
    this.gyro = {}

    this.lazy = new LazyBrush(50)
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
  }

  get state () {
    return {
      brush: this.brush,
      isPressing: this.isPressing,
      lazyRadius: this.lazy.radius,
      sizes: {
        viewport: this.viewport,
        canvasRect: this.canvasRect
      },
      points: {
        brush: this.lazy.brush.toObject(),
        mouse: this.lazy.mouse.toObject()
      }
    }
  }

  init () {
    this.gyro = new GyroTransform(this.viewport.width * 1, this.viewport.width, this.viewport.height)

    this.threads.trigger(THREAD_BRUSH)
    this.loop()
  }

  loop () {
    this.threads.step(this.state, () => {
      window.requestAnimationFrame(() => this.loop())
    })
  }

  updatePointer (coordinates) {
    this.lazy.update(coordinates, (hasChanged) => {
      if (hasChanged) {
        this.threads.trigger(THREAD_POINT)
        if (this.toolbarRect.containsPoint(this.lazy.mouse)) {
          this.threads.trigger(THREAD_TOOLS)
        }
      }
    })
  }

  updateFromRemote (data) {
    const coordinates = this.gyro.getPointOnScreen(data)

    this.updatePointer(coordinates)
    this.updateIsPressing(data.isPressingMain)
    this.updateSlideY(data.touchDiffY)
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
    if (this.slideY !== slideY) {
      this.slideY = slideY
      this.threads.trigger(THREAD_SLIDE)
    }
  }

  updateCalibrationOffset (angle) {
    this.gyro.updateCalibrationOffset(angle)
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
    this.gyro.updateSizes(viewport)
    this.threads.trigger(THREAD_STATE)
  }

  updateUseLazyBrush (useLazyBrush) {
    if (useLazyBrush) {
      this.lazy.enable()
    } else {
      this.lazy.disable()
    }
  }

  updateLazyRadius (radius) {
    // this.lazy.setRadius(radius)
  }

  updateBrushColor (color) {
    this.brush.setColor(color)
    this.threads.trigger(THREAD_BRUSH)
  }
}
