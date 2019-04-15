/**
 * Returns the state from the Vuetamin data.
 *
 * @param {Object} data Vuetamin data.
 * @returns {Object} The state.
 */
export default function(data) {
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
    touch: data.touch,
    pointingAtToolbar: data.pointingAtToolbar,
    gymoteDistance: data.gymoteDistance
  }
}
