/**
 * A line
 * @param l0 Support vector
 * @param l  Another vector on the line, direction vector will be calculated
 * @constructor
 */
export default class Line {
  constructor (l0, l) {
    this.l0 = l0
    this.l = l.minus(l0) // Calculate direction vector
    this.lPrime = l
  }

  /**
   * Rotates the line by two given angles
   * @param alpha Angle alpha
   * @param beta  Angle beta
   */
  rotate (alpha, beta) {
    if (alpha > 0) {
      this.l = this.l.rotate('x', alpha)
    }

    if (beta > 0) {
      this.l = this.l.rotate('z', beta)
    }
  }

  /**
   * Rotates only the direction vector around a given line by a given angle
   * @param line
   * @param angle
   * @returns {Line}
   */
  rotateDirectionAroundLine (line, angle) {
    return new Line(
      this.l0,
      this.lPrime.rotateAroundLine(line, angle)
    )
  }

  /**
   * Rotates the whole line around another line by a given angle
   * @param line
   * @param angle
   * @returns {Line}
   */
  rotateAroundLine (line, angle) {
    return new Line(
      this.l0.rotateAroundLine(line, angle),
      this.lPrime.rotateAroundLine(line, angle)
    )
  }
}
