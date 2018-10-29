import { GyroPlane } from 'gyro-plane'
import { LazyBrush } from 'lazy-brush'
import Rectangle from '@/classes/Rectangle'
import Brush from '@/classes/Brush'

import { getCookie, setCookie } from '@/tools/helpers'

export const threads = {
  BRUSH: 'brush',
  POINT: 'point',
  SLIDE: 'slide',
  STATE: 'state',
  TOOLS: 'tools',
  SIZES: 'sizes',
  BRUSH_RADIUS: 'brushRadius',
  BRUSH_OPACITY: 'brushOpacity',
  BRUSH_HARDNESS: 'brushHardness',
  BRUSH_COLOR: 'brushColor',
  LAZYRADIUS: 'lazyRadius',
  DISTANCE: 'distance'
}

export const store = {
  state: function (data) {
    return {
      brush: data.brush,
      isPressing: data.isPressing,
      lazyRadius: data.lazyBrush.radius,
      sizes: {
        viewport: data.viewport,
        canvasRect: data.canvasRect,
        toolbarRect: data.toolbarRect,
        footerRect: data.footerRect
      },
      points: {
        brush: data.lazyBrush.brush.toObject(),
        pointer: data.lazyBrush.pointer.toObject()
      },
      distance: data.distance,
      slideY: data.slideY,
      pointingAtToolbar: data.pointingAtToolbar
    }
  },

  data: function () {
    const viewport = {
      width: 1280,
      height: 900,
      ratio: 1
    }

    const distance = viewport.width * 1.1

    const cookie = getCookie('state')
    let brushOptions = {}

    if (cookie) {
      try {
        const cookieObject = JSON.parse(cookie)

        brushOptions = cookieObject.brush
      } catch (e) {
        console.log('Invalid cookie data.')
      }
    }

    return {
      gyro: new GyroPlane({
        width: viewport.width,
        height: viewport.height,
        distance: distance
      }),

      lazyBrush: new LazyBrush({
        radius: 80
      }),

      lazyPointer: new LazyBrush({
        radius: 5,
        enabled: false
      }),

      brush: new Brush(brushOptions),

      isPressing: false,
      slideY: 0,

      viewport: viewport,

      distance: distance,

      canvasRect: new Rectangle(0, 0, 0, 0),
      toolbarRect: new Rectangle(0, 0, 0, 0),
      footerRect: new Rectangle(0, 0, 0, 0),

      pointingAtToolbar: false,
      hasCalibrated: false,

      cookieTimout: null,

      canvasFilterSupported: false
    }
  },

  mutations: {
    updatePointer: function ({ data, trigger }, { coordinates, both = false } = {}) {
      const updateBoth = both || data.hasCalibrated
      const hasChanged = data.lazyBrush.update(coordinates, { both: updateBoth })

      data.hasCalibrated = false

      if (hasChanged) {
        trigger(threads.POINT)
        if (data.toolbarRect.containsPoint(data.lazyBrush.pointer) && (!data.isPressing || data.pointingAtToolbar)) {
          data.pointingAtToolbar = true
          trigger(threads.TOOLS)
        } else {
          if (data.pointingAtToolbar) {
            trigger(threads.TOOLS)
          }
          if (!data.isPressing) {
            data.pointingAtToolbar = false
          }
        }
      }
    },

    updateFromRemote: function ({ data, mutate }, remoteData) {
      data.gyro.updateOrientation(remoteData)

      const coordinates = data.gyro.getScreenCoordinates()

      const hasChanged = data.lazyPointer.update(coordinates)

      if (hasChanged) {
        mutate('updatePointer', { coordinates: data.lazyPointer.brush })
        mutate('updateIsPressing', { isPressing: remoteData.isPressingMain })
      }

      mutate('updateSlideY', remoteData.touchDiffY)
    },

    updateIsPressing: function ({ data, trigger }, { isPressing = false, fromMouse = false } = {}) {
      if (data.isPressing !== isPressing) {
        data.isPressing = isPressing
        trigger(threads.POINT)

        if (!fromMouse) {
          trigger(threads.TOOLS)
        }
      }
    },

    updateSlideY: function ({ data, trigger }, slideY) {
      if (data.slideY !== slideY && data.pointingAtToolbar) {
        data.slideY = slideY
        trigger(threads.TOOLS)
      }
    },

    updateCalibrationOffset: function ({ data }, angle) {
      data.gyro.updateOffset(angle)
      data.hasCalibrated = true
    },

    updateCanvasRect: function ({ data, trigger }, rect) {
      data.canvasRect.setFromDOMRect(rect)
      trigger(threads.STATE)
    },

    updateToolbarRect: function ({ data, trigger }, rect) {
      data.toolbarRect.setFromDOMRect(rect)
      trigger(threads.STATE)
    },

    updateFooterRect: function ({ data, trigger }, rect) {
      data.footerRect.setFromDOMRect(rect)
      trigger(threads.STATE)
    },

    updateViewport: function ({ data, trigger }, viewport) {
      data.viewport = viewport
      data.gyro.setScreenDimensions(viewport)
      trigger(threads.STATE)
      trigger(threads.SIZES)
    },

    updateUseLazyBrush: function ({ data }, useLazyBrush) {
      if (useLazyBrush) {
        data.lazyBrush.enable()
      } else {
        data.lazyBrush.disable()
      }
    },

    updateLazyRadius: function ({ data, trigger, action }, radius) {
      data.lazyBrush.setRadius(radius)
      trigger(threads.BRUSH)
      trigger(threads.LAZYRADIUS)
      action('storeStateCookie')
    },

    updateBrushColor: function ({ data, trigger, action }, color) {
      data.brush.setColor(color)
      trigger(threads.BRUSH)
      trigger(threads.BRUSH_COLOR)
      action('storeStateCookie')
    },

    updateBrushOpacity: function ({ data, trigger, action }, opacity) {
      data.brush.setOpacity(opacity)
      trigger(threads.BRUSH)
      trigger(threads.BRUSH_OPACITY)
      action('storeStateCookie')
    },

    updateBrushRadius: function ({ data, trigger, action }, radius) {
      data.brush.setRadius(radius)
      trigger(threads.BRUSH)
      trigger(threads.BRUSH_RADIUS)
      action('storeStateCookie')
    },

    updateBrushHardness: function ({ data, trigger, action }, hardness) {
      data.brush.setHardness(hardness)
      trigger(threads.BRUSH)
      trigger(threads.BRUSH_HARDNESS)
      action('storeStateCookie')
    },

    updateCanvasFilterSupport: function ({ data }, isSupported) {
      data.canvasFilterSupported = isSupported
      data.brush.setFilterSupport(isSupported)
    },

    updateDistance: function ({ trigger, data }, distance) {
      data.distance = distance
      data.gyro.setDistance(distance)
      trigger(threads.DISTANCE)
    }
  },

  actions: {
    storeStateCookie: function ({ data }, { noTimeout } = {}) {
      const timeout = noTimeout ? 0 : 5000

      window.clearTimeout(data.cookieTimout)
      data.cookieTimout = window.setTimeout(() => {
        setCookie('state', JSON.stringify({
          brush: data.brush.state
        }))
      }, timeout)
    }
  }
}
