const DECIMALS = 15

/**
 * A simple vector
 * @param x X-Coordinate
 * @param y Y-Coordinate
 * @param z Z-Coordinate
 * @constructor
 */
export default class Vector {
  constructor (x, y, z) {
    this.x = Number(x === 0 ? 0 : x)
    this.y = Number(y === 0 ? 0 : y)
    this.z = Number(z === 0 ? 0 : z)
  }

  /**
   * Subtract another Vector from this one
   * @param b The other vector
   * @returns {Vector}
   */
  minus (b) {
    return new Vector(
      (this.x - b.x),
      (this.y - b.y),
      (this.z - b.z)
    )
  }

  /**
   * Add another Vector to this Vector
   * @param b The other Vector
   * @returns {Vector}
   */
  plus (b) {
    return new Vector(
      (this.x + b.x),
      (this.y + b.y),
      (this.z + b.z)
    )
  }

  /**
   * Rotates this vector by a given angle on a given axis
   * @param axis  x, y or z
   * @param angle Angle in degrees
   * @returns {Vector}
   */
  rotate (axis, angle) {
    angle = angle / 180 * Math.PI // Degrees to radians

    var sin = Math.sin(angle)
    var cos = Math.cos(angle)

    return this.applyMatrix([
      [
        (axis === 'x' ? 1 : cos).toFixed(DECIMALS),
        (axis === 'z' ? sin : 0).toFixed(DECIMALS),
        (axis === 'y' ? -1 * sin : 0).toFixed(DECIMALS)
      ],
      [
        (axis === 'z' ? -1 * sin : 0).toFixed(DECIMALS),
        (axis === 'y' ? 1 : cos).toFixed(DECIMALS),
        (axis === 'x' ? sin : 0).toFixed(DECIMALS)
      ],
      [
        (axis === 'y' ? sin : 0).toFixed(DECIMALS),
        (axis === 'x' ? -1 * sin : 0).toFixed(DECIMALS),
        (axis === 'z' ? 1 : cos).toFixed(DECIMALS)
      ]
    ])
  }

  /**
   * Rotates a vector around a line
   * @param axis
   * @param angle
   * @returns {Vector}
   */
  rotateAroundLine (axis, angle) {
    var n = axis.l.normalize()

    // Move vector through 0/0/0, rotate, and move back again
    return this.minus(axis.l0).rotateAroundVector(n, angle).plus(axis.l0)
  }

  /**
   * Rotates this vector around another one
   * @param vector The vector to rotate around
   * @param angle  The angle of the rotation
   * @returns {Vector}
   */
  rotateAroundVector (vector, angle) {
    var n1 = vector.x
    var n2 = vector.y
    var n3 = vector.z

    angle = angle / 180 * Math.PI // Degrees to radians

    var sin = Math.sin(angle)
    var cos = Math.cos(angle)

    return this.applyMatrix([
      [
        (((n1 * n1) * (1 - cos)) + cos),
        (((n2 * n1) * (1 - cos)) + (n3 * sin)),
        (((n3 * n1) * (1 - cos)) - (n2 * sin))
      ],
      [
        (((n1 * n2) * (1 - cos)) - (n3 * sin)),
        (((n2 * n2) * (1 - cos)) + cos),
        (((n3 * n2) * (1 - cos)) + (n1 * sin))
      ],
      [
        (((n1 * n3) * (1 - cos)) + (n2 * sin)),
        (((n2 * n3) * (1 - cos)) - (n1 * sin)),
        (((n3 * n3) * (1 - cos)) + cos)
      ]
    ])
  }

  /**
   * Normalizes a vector, i.e. transforms it to a length of 1
   * @returns {Vector}
   */
  normalize () {
    var factor = 1 / this.getLength()

    return new Vector(
      this.x * factor,
      this.y * factor,
      this.z * factor
    )
  }

  /**
   * Applies a rotation matrix m
   * @param m The rotation matrix
   * @returns {Vector}
   */
  applyMatrix (m) {
    return new Vector(
      ((m[0][0] * this.x) + (m[1][0] * this.y) + (m[2][0] * this.z)).toFixed(DECIMALS),
      ((m[0][1] * this.x) + (m[1][1] * this.y) + (m[2][1] * this.z)).toFixed(DECIMALS),
      ((m[0][2] * this.x) + (m[1][2] * this.y) + (m[2][2] * this.z)).toFixed(DECIMALS)
    )
  }

  /**
   * Multiply this Vector with a given scalar
   * @param a The sacalr
   * @returns {Vector}
   */
  times (a) {
    return new Vector(
      this.x * a,
      this.y * a,
      this.z * a
    )
  }

  /**
   * Checks if this Vector is linearly dependent on another Vector
   * @param b The other Vector
   * @returns {boolean}
   */
  isLinearlyDependentOn (b) {
    return (
      (this.x / b.x) === (this.y / b.y) &&
      (this.x / b.y) === (this.z / b.z) &&
      (this.y / b.y) === (this.z / b.z)
    )
  }

  /**
   * Calculate the cross product of this Vector and another
   * @param b The other Vector
   * @returns {Vector}
   */
  cross (b) {
    return new Vector(
      (this.y * b.z - this.z * b.y),
      (this.z * b.x - this.x * b.z),
      (this.x * b.y - this.y * b.x)
    )
  }

  /**
   * Calculate the scalar product of this Vector and another
   * @param b The other Vector
   * @returns {Number}
   */
  scalarProduct (b) {
    return (this.x * b.x) - (this.y * b.y) - (this.z * b.z)
  }

  /**
   * Calculates the length of the vector
   * @returns {Number}
   */
  getLength () {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }
}
