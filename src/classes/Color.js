import { getRgbaString } from '@/tools/helpers.js'

function hexToRgb (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null
}

export default class Color {
  constructor ({ name, rgb = [0, 0, 0], hex } = {}) {
    console.log(hex)
    this.name = name
    this.rgb = hex ? hexToRgb(hex) : rgb
  }

  setColor (rgb) {
    this.rgb = rgb
  }

  getRgbaString (alpha) {
    return getRgbaString(this.rgb, alpha / 100)
  }
}
