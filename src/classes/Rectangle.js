import { Point } from 'lazy-brush'

export default class Rectangle {
  constructor (x, y, width, height) {
    this.p1 = new Point(x, y)
    this.p2 = new Point(x + width, y + height)
  }

  /**
   * @returns {Number} The width of the rectangle.
   */
  get width () {
    return this.p2.x - this.p1.x
  }

  /**
   * @returns {Number} The height of the rectangle.
   */
  get height () {
    return this.p2.y - this.p1.y
  }

  /**
   * Set the rectangles points based on the values from a DOMRect.
   *
   * @param {DOMRect} domRect
   */
  setFromDOMRect (domRect) {
    this.p1.x = domRect.left
    this.p1.y = domRect.top
    this.p2.x = domRect.left + domRect.width
    this.p2.y = domRect.top + domRect.height
  }

  /**
   * Check if the given point is within this rectangle.
   *
   * @param {Point} point An object containing x and y properties.
   * @returns {Boolean}
   */
  containsPoint (point) {
    return this.p1.x <= point.x && point.x <= this.p2.x && this.p1.y <= point.y && point.y <= this.p2.y
  }
}
