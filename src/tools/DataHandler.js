import { GyroPlane } from 'gyro-plane'
import { LazyBrush } from 'lazy-brush'

import Brush from '@/classes/Brush'
import Threads from '@/classes/Threads'
import Rectangle from '@/classes/Rectangle'

import { getCookie, setCookie } from '@/tools/helpers'

import {
  THREAD_POINT,
  THREAD_BRUSH,
  THREAD_STATE,
  THREAD_TOOLS,
  THREAD_SIZES,
  THREAD_BRUSH_RADIUS,
  THREAD_BRUSH_HARDNESS,
  THREAD_BRUSH_OPACITY,
  THREAD_BRUSH_COLOR,
  THREAD_LAZYRADIUS,
  THREAD_DISTANCE
} from '@/settings/drawthreads'

export default class DataHandler {
  constructor () {
    this.gyro = {}

    this.lazyBrush = new LazyBrush({
      radius: 80
    })

    this.lazyPointer = new LazyBrush({
      radius: 5,
      enabled: false
    })

    this.brush = null
    this.threads = new Threads()

    this.isPressing = false
    this.slideY = 0

    this.viewport = {
      width: 1280,
      height: 900,
      ratio: 1
    }

    this.distance = this.viewport.width * 1.1

    this.canvasRect = new Rectangle(0, 0, 0, 0)
    this.toolbarRect = new Rectangle(0, 0, 0, 0)

    this.pointingAtToolbar = false
    this.hasCalibrated = false

    this.cookieTimout = null

    this.canvasFilterSupported = false
  }

  get state () {
    return {
      brush: this.brush,
      isPressing: this.isPressing,
      lazyRadius: this.lazyBrush.radius,
      sizes: {
        viewport: this.viewport,
        canvasRect: this.canvasRect,
        toolbarRect: this.toolbarRect
      },
      points: {
        brush: this.lazyBrush.brush.toObject(),
        pointer: this.lazyBrush.pointer.toObject()
      },
      distance: this.distance,
      slideY: this.slideY,
      pointingAtToolbar: this.pointingAtToolbar
    }
  }

  init () {
    this.gyro = new GyroPlane({
      width: this.viewport.width,
      height: this.viewport.height,
      distance: this.distance
    })

    const cookie = getCookie('brush')
    let brush = {}

    if (cookie) {
      brush = JSON.parse(cookie)
    }

    this.brush = new Brush(brush)

    this.threads.trigger(THREAD_BRUSH)
    this.loop()
  }

  loop () {
    this.threads.step(this.state, () => {
      window.requestAnimationFrame(() => this.loop())
    })
  }

  updatePointer (coordinates, both = false) {
    const updateBoth = both || this.hasCalibrated
    const hasChanged = this.lazyBrush.update(coordinates, { both: updateBoth })

    this.hasCalibrated = false

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
    }

    this.updateSlideY(data.touchDiffY)
  }

  addHandler (event, uid, context) {
    this.threads.addHandler(event, uid, context)
  }

  removeHandler (event, uid) {
    this.threads.removeHandler(event, uid)
  }

  updateFromMouse (coordinates, both) {
    this.updatePointer(coordinates, both)
  }

  updateIsPressing (isPressing, { fromMouse } = {}) {
    if (this.isPressing !== isPressing) {
      this.isPressing = isPressing
      this.threads.trigger(THREAD_POINT)

      if (!fromMouse) {
        this.threads.trigger(THREAD_TOOLS)
      }
    }
  }

  updateSlideY (slideY) {
    if (this.slideY !== slideY && this.pointingAtToolbar) {
      this.slideY = slideY
      this.threads.trigger(THREAD_TOOLS)
    }
  }

  updateCalibrationOffset (angle) {
    this.gyro.updateOffset(angle)
    this.hasCalibrated = true
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
    this.threads.trigger(THREAD_SIZES)
  }

  updateUseLazyBrush (useLazyBrush) {
    if (useLazyBrush) {
      this.lazyBrush.enable()
    } else {
      this.lazyBrush.disable()
    }
  }

  updateLazyRadius (radius) {
    this.lazyBrush.setRadius(radius)
    this.threads.trigger(THREAD_BRUSH)
    this.threads.trigger(THREAD_LAZYRADIUS)
    this.storeBrushCookie()
  }

  updateBrushColor (color) {
    this.brush.setColor(color)
    this.threads.trigger(THREAD_BRUSH)
    this.threads.trigger(THREAD_BRUSH_COLOR)
    this.storeBrushCookie()
  }

  updateBrushOpacity (opacity) {
    this.brush.setOpacity(opacity)
    this.threads.trigger(THREAD_BRUSH)
    this.threads.trigger(THREAD_BRUSH_OPACITY)
    this.storeBrushCookie()
  }

  updateBrushRadius (radius) {
    this.brush.setRadius(radius)
    this.threads.trigger(THREAD_BRUSH)
    this.threads.trigger(THREAD_BRUSH_RADIUS)
    this.storeBrushCookie()
  }

  updateBrushHardness (hardness) {
    this.brush.setHardness(hardness)
    this.threads.trigger(THREAD_BRUSH)
    this.threads.trigger(THREAD_BRUSH_HARDNESS)
    this.storeBrushCookie()
  }

  updateCanvasFilterSupport (isSupported) {
    this.canvasFilterSupported = isSupported
    this.brush.setFilterSupport(isSupported)
  }

  updateDistance (distance) {
    this.distance = distance
    this.gyro.setDistance(distance)
    this.threads.trigger(THREAD_DISTANCE)
  }

  storeBrushCookie () {
    window.clearTimeout(this.cookieTimout)
    this.cookieTimout = window.setTimeout(() => {
      setCookie('brush', JSON.stringify(this.brush.state))
    }, 5000)
  }
}
