import { GyroTransform } from '@/tools/GyroTransform.js'
import { parseDataString, pointOutsideCircle, movePointAtAngle } from '@/tools/helpers.js'

export default class DataHandler {
  constructor () {
    this.gyro = {}

    this.pointerCoordinates = { x: 0, y: 0 }
    this.brushCoordinates = { x: 0, y: 0 }
    this.canvasCoordinates = { x: 0, y: 0 }
    this.prevCanvasCoordinates = { x: 0, y: 0 }

    this.isPressing = false
    this.slideY = 0

    this.angleOffset = { alpha: 0, beta: 0 }

    this.useLazyBrush = true
    this.lazyRadius = 50

    this.canvasRect = {}
    this.viewport = {
      width: 1280,
      height: 900,
      ratio: 1
    }
  }

  init () {
    this.gyro = new GyroTransform(this.viewport.width * 1, this.viewport.width, this.viewport.height)
  }

  update (dataString) {
    const data = parseDataString(dataString)
    const calibratedAlpha = 0 - data.alpha + this.angleOffset.alpha
    const calibratedBeta = data.beta - this.angleOffset.beta

    this.pointerCoordinates = this.gyro.getPointOnScreen(calibratedAlpha, calibratedBeta)
    this.updateBrushCoordinates()
    this.updateCanvasCoordinates()

    if (this.isPressing !== data.isPressingMain) {
      this.isPressing = data.isPressingMain
    }

    this.slideY = data.touchDiffY
  }

  updateFromMouse (coordinates) {
    this.pointerCoordinates = coordinates
    this.updateBrushCoordinates()
    this.updateCanvasCoordinates()
  }

  updateCanvasCoordinates () {
    this.prevCanvasCoordinates = this.canvasCoordinates

    this.canvasCoordinates = {
      x: Math.round(this.brushCoordinates.x),
      y: Math.round(this.brushCoordinates.y)
    }
  }

  updateBrushCoordinates () {
    const coordinates = {
      x: Math.round(this.pointerCoordinates.x - this.canvasRect.left),
      y: Math.round(this.pointerCoordinates.y - this.canvasRect.top)
    }
    if (this.useLazyBrush) {
      // Find the difference of the pointer coordinates to the brush
      const diff = {
        x: coordinates.x - this.brushCoordinates.x,
        y: coordinates.y - this.brushCoordinates.y
      }

      // The distance between the position of the brush and the pointer,
      // minus the lazyRadius
      const distance = Math.sqrt(diff.x * diff.x + diff.y * diff.y) - this.lazyRadius

      // If the pointer is outside the lazy area, update the position of the brush
      if (pointOutsideCircle(coordinates, this.brushCoordinates, this.lazyRadius)) {
        // Use the difference of the pointer to the brush to get the angle in radians
        const angle = Math.atan2(diff.y, diff.x)

        // Update the brush coordinates by moving it by the calculated distance to the pointer
        // and at the right angle.
        this.brushCoordinates = movePointAtAngle(this.brushCoordinates, angle, distance)
      }
    } else {
      this.brushCoordinates = this.coordinates
    }
  }

  updateOffset (angle) {
    this.angleOffset = angle
  }

  updateCanvasRect (rect) {
    this.canvasRect = rect
  }

  updateToolbarRect (rect) {
    this.toolbarRect = rect
  }

  updateViewport (viewport) {
    this.viewport = viewport
    this.gyro.updateSizes(viewport)
  }

  updateUseLazyBrush (useLazyBrush) {
    this.useLazyBrush = useLazyBrush
  }

  updateLazyRadius (radius) {
    this.lazyRadius = radius
  }
}
