import Line from '@/tools/Vector/Line'
import Plane from '@/tools/Vector/Plane'
import Vector from '@/tools/Vector/Vector'

export class GyroTransform {
  constructor (distance, width, height) {
    this.distance = distance
    this.width = width
    this.height = height

    const phoneZPos = distance
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

  getPointOnScreen (alpha, beta) {
    const phoneLinePrime = this.phoneLine.rotateAroundLine(this.yAxis, alpha)
        .rotateAroundLine(this.xAxis, 180 - beta)
    const interSectionVector = this.screenPlane.getIntersectionWith(phoneLinePrime)

    return {
      x: interSectionVector.x / 2,
      y: interSectionVector.y / 2
    }
  }
}
