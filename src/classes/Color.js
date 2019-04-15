import { getRgbaString, hexToRgb } from '@/tools/helpers.js'

/**
 * Manages a color.
 */
export default class Color {
  constructor({ name, rgb = [0, 0, 0], hex } = {}) {
    this.name = name
    this.rgb = hex ? hexToRgb(hex) : rgb
  }

  /**
   * Set the color.
   *
   * @param {Array} rgb The rgb values as an array.
   */
  setColor(rgb) {
    this.rgb = rgb
  }

  /**
   * Build an rgba string given the alpha value.
   *
   * @param {Number} alpha The alpha value to be used (0 - 100).
   */
  getRgbaString(alpha) {
    return getRgbaString(this.rgb, alpha / 100)
  }
}
