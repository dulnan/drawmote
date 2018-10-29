import { getRgbaString } from '@/tools/helpers.js'

/**
 * Convert a hex color string to rgb values.
 *
 * @param {String} hex The hex string to convert.
 * @returns {Array} The converted rgb values as an array.
 */
function hexToRgb (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null
}

/**
 * Manages a color.
 */
export default class Color {
  constructor ({ name, rgb = [0, 0, 0], hex } = {}) {
    this.name = name
    this.rgb = hex ? hexToRgb(hex) : rgb
  }

  /**
   * Set the color.
   *
   * @param {Array} rgb The rgb values as an array.
   */
  setColor (rgb) {
    this.rgb = rgb
  }

  /**
   * Build an rgba string given the alpha value.
   *
   * @param {Number} alpha The alpha value to be used (0 - 100).
   */
  getRgbaString (alpha) {
    return getRgbaString(this.rgb, alpha / 100)
  }
}
