import { Vector, Line, Plane } from 'vanilla-vectors-3d'

export class GyroTransform {
  constructor (distance, width, height) {
    this.distance = distance
    this.width = width
    this.height = height

    this.init()
  }

  init () {
    const phoneZPos = this.distance
    const xCenter = this.width / 2
    const yCenter = this.height / 2

    this.screenPlane = new Plane(
      new Vector(0, 0, 0),
      new Vector(this.width, 0, 0),
      new Vector(0, this.height, 0)
    )

    this.xAxis = new Line(
      new Vector(xCenter - 100, yCenter, phoneZPos),
      new Vector(xCenter + 100, yCenter, phoneZPos)
    )

    this.yAxis = new Line(
      new Vector(xCenter, yCenter - 100, phoneZPos),
      new Vector(xCenter, yCenter + 100, phoneZPos)
    )

    this.phoneLine = new Line(
      new Vector(xCenter, yCenter, phoneZPos),
      new Vector(xCenter, yCenter, phoneZPos / 2)
    )
  }

  updateSizes ({ width, height }) {
    this.width = width
    this.height = height

    this.init()
  }

  getPointOnScreen (alpha, beta) {
    const phoneLinePrime = this.phoneLine.rotateAroundLine(this.yAxis, alpha)
        .rotateAroundLine(this.xAxis, 180 - beta)
    const interSectionVector = this.screenPlane.getIntersectionWith(phoneLinePrime)

    return {
      x: Math.round(interSectionVector.x),
      y: Math.round(interSectionVector.y)
    }
  }
}
