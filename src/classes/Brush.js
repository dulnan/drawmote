import {
  DEFAULT_COLOR,
  RADIUS_DEFAULT,
  HARDNESS_DEFAULT,
  OPACITY_DEFAULT
} from '@/settings'

import Color from '@/classes/Color'

export default class Brush {
  constructor (brush = {}) {
    this.color = new Color(brush.color || DEFAULT_COLOR)
    this.radius = brush.radius || RADIUS_DEFAULT
    this.hardness = brush.hardness || HARDNESS_DEFAULT
    this.opacity = brush.opacity || OPACITY_DEFAULT
    this.style = 'smudge'
  }

  get state () {
    return {
      color: this.color,
      radius: this.radius,
      hardness: this.hardness,
      opacity: this.opacity,
      style: this.style
    }
  }

  get canvasRadius () {
    return ((this.hardness / 100) + 1) * this.radius
  }

  get canvasBlur () {
    return ((1 - (this.hardness / 100)) * this.radius)
  }

  get canvasColor () {
    return this.color.getRgbaString(this.opacity)
  }

  get canvasProperties () {
    return {
      lineJoin: 'round',
      lineCap: 'round',
      lineWidth: this.canvasRadius * 2,
      filter: `blur(${this.canvasBlur}px)`,
      globalAlpha: 1,
      strokeStyle: this.canvasColor,
      fillStyle: this.canvasColor
    }
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
