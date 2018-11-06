import threads from './threads'

export function updatePointer ({ data, trigger }, { coordinates, both = false } = {}) {
  const updateBoth = both || data.hasCalibrated
  const hasChanged = data.lazyBrush.update(coordinates, { both: updateBoth })

  data.hasCalibrated = false

  // TODO VERY HARD
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
}

export function updateFromRemote ({ data, mutate }, remoteData) {
  data.gyro.updateOrientation(remoteData)

  const coordinates = data.gyro.getScreenCoordinates()

  const hasChanged = data.lazyPointer.update(coordinates)

  if (hasChanged) {
    mutate('updatePointer', { coordinates: data.lazyPointer.brush })
    mutate('updateIsPressing', { isPressing: remoteData.isPressingMain })
  }

  mutate('updateSlideY', remoteData.touchDiffY)
}

export function updateIsPressing ({ data, trigger }, { isPressing = false, fromMouse = false } = {}) {
  if (data.isPressing !== isPressing) {
    data.isPressing = isPressing
    trigger(threads.POINT)

    if (!fromMouse) {
      trigger(threads.TOOLS)
    }
  }
}

export function updateSlideY ({ data, trigger }, slideY) {
  if (data.slideY !== slideY && data.pointingAtToolbar) {
    data.slideY = slideY
    trigger(threads.TOOLS)
  }
}

export function updateCalibrationOffset ({ data }, angle) {
  data.gyro.updateOffset(angle)
  data.hasCalibrated = true
}

export function updateCanvasRect ({ data, trigger }, rect) {
  data.canvasRect.setFromDOMRect(rect)
  trigger(threads.STATE)
}

export function updateToolbarRect ({ data, trigger }, rect) {
  data.toolbarRect.setFromDOMRect(rect)
  trigger(threads.STATE)
}

export function updateFooterRect ({ data, trigger }, rect) {
  data.footerRect.setFromDOMRect(rect)
  trigger(threads.STATE)
}

export function updateViewport ({ data, trigger }, viewport) {
  data.viewport = viewport
  data.gyro.setScreenDimensions(viewport)
  trigger(threads.STATE)
  trigger(threads.SIZES)
}

export function updateUseLazyBrush ({ data }, useLazyBrush) {
  if (useLazyBrush) {
    data.lazyBrush.enable()
  } else {
    data.lazyBrush.disable()
  }
}

export function updateLazyRadius ({ data, trigger, action }, radius) {
  data.lazyBrush.setRadius(radius)
  trigger(threads.BRUSH)
  trigger(threads.LAZYRADIUS)
  action('storeStateCookie')
}

export function updateBrushColor ({ data, trigger, action }, color) {
  data.brush.setColor(color)
  trigger(threads.BRUSH)
  trigger(threads.BRUSH_COLOR)
  action('storeStateCookie')
}

export function updateBrushOpacity ({ data, trigger, action }, opacity) {
  data.brush.setOpacity(opacity)
  trigger(threads.BRUSH)
  trigger(threads.BRUSH_OPACITY)
  action('storeStateCookie')
}

export function updateBrushRadius ({ data, trigger, action }, radius) {
  data.brush.setRadius(radius)
  trigger(threads.BRUSH)
  trigger(threads.BRUSH_RADIUS)
  action('storeStateCookie')
}

export function updateBrushHardness ({ data, trigger, action }, hardness) {
  data.brush.setHardness(hardness)
  trigger(threads.BRUSH)
  trigger(threads.BRUSH_HARDNESS)
  action('storeStateCookie')
}

export function updateCanvasFilterSupport ({ data }, isSupported) {
  data.canvasFilterSupported = isSupported
  data.brush.setFilterSupport(isSupported)
}

export function updateDistance ({ trigger, data }, distance) {
  data.distance = distance
  data.gyro.setDistance(distance)
  trigger(threads.DISTANCE)
}

export function updateConnection ({ trigger, data }, { connected = false, device = '' } = {}) {
  data.connection.connected = connected
  data.connection.device = device
  trigger(threads.CONNECTION)
}
