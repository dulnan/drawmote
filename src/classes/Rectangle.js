import { Point } from 'lazy-brush'

export default class Rectangle {
  constructor (x, y, width, height) {
    this.p1 = new Point(x, y)
    this.p2 = new Point(x + width, y + height)
  }

  get width () {
    return this.p2.x - this.p1.x
  }

  get height () {
    return this.p2.y - this.p1.y
  }

  setFromDOMRect (domRect) {
    this.p1.x = domRect.left
    this.p1.y = domRect.top
    this.p2.x = domRect.left + domRect.width
    this.p2.y = domRect.top + domRect.height
  }

  containsPoint (point) {
    return this.p1.x <= point.x && point.x <= this.p2.x && this.p1.y <= point.y && point.y <= this.p2.y
  }
}
