import Action from './Action'
import { midPointBetween } from '@/tools/helpers.js'

/**
 * A canvas drawing action.
 */
export default class DrawAction extends Action {
  constructor(canvasProperties) {
    super('stroke')
    this.canvasProperties = canvasProperties
    this.points = []
  }

  /**
   * Set the properties on the canvas.
   *
   * @param {Object} props An object with canvas properties and the desired values.
   */
  setCanvasProperties(canvas) {
    const context = canvas.getContext('2d')

    Object.keys(this.canvasProperties).forEach(p => {
      context[p] = this.canvasProperties[p]
    })
  }

  /**
   * Draws the action to the canvas.
   *
   * @param {HTMLCanvasElement} canvas The canvas to draw on to.
   */
  do(canvas) {
    // First prepare the canvas with the properties from the action.
    this.setCanvasProperties(canvas)

    const c = canvas.getContext('2d')
    let p1 = this.points[0]
    let p2 = this.points[1]

    c.beginPath()
    c.moveTo(p1.x, p1.y)

    for (let i = 1; i < this.points.length; i++) {
      // we pick the point between pi+1 & pi+2 as the
      // end point and p1 as our control point
      const midPoint = midPointBetween(p1, p2)
      c.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y)
      p1 = this.points[i]
      p2 = this.points[i + 1]
    }
    // Draw last line as a straight line while
    // we wait for the next point to be able to calculate
    // the bezier control point
    c.lineTo(p1.x, p1.y)
    c.stroke()
  }
}
