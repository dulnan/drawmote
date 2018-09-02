import { getRgbaString } from '@/tools/helpers.js'

export default class Color {
  constructor ({ name, rgb }) {
    this.name = name
    this.rgb = rgb
  }

  setColor (rgb) {
    this.rgb = rgb
  }

  getRgbaString (alpha) {
    return getRgbaString(this.rgb, alpha / 100)
  }
}
