import {
  DEFAULT_COLOR,
  RADIUS_DEFAULT,
  HARDNESS_DEFAULT,
  OPACITY_DEFAULT
} from '@/settings'

import Color from '@/classes/Color'

export default class Brush {
  constructor () {
    this.color = new Color(DEFAULT_COLOR)
    this.radius = RADIUS_DEFAULT
    this.hardness = HARDNESS_DEFAULT
    this.opacity = OPACITY_DEFAULT
    this.style = 'smudge'
  }

  setColor (color) {
    this.color = color
  }

  setRadius (radius) {
    this.radius = radius
  }

  setHardness (hardness) {
    this.hardness = hardness
  }

  setOpacity (opacity) {
    this.opacity = opacity
  }

  setStyle (style) {
    this.style = style
  }
}
