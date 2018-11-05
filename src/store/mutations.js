import threads from './threads'

export default {
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
}
