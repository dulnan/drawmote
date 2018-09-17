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

    this.useFilter = false
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
    if (!this.useFilter) {
      return this.radius
    }
    return ((this.hardness / 100) + 1) * this.radius
  }

  get canvasBlur () {
    return ((1 - (this.hardness / 100)) * this.radius)
  }

  get canvasColor () {
    return this.color.getRgbaString(this.opacity)
  }

  get canvasProperties () {
    const properties = {
      lineJoin: 'round',
      lineCap: 'round',
      lineWidth: this.canvasRadius * 2,
      globalAlpha: 1,
      strokeStyle: this.canvasColor,
      fillStyle: this.canvasColor
    }

    if (this.useFilter) {
      properties.filter = `blur(${this.canvasBlur}px)`
    }

    return properties
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

  setFilterSupport (isSupported) {
    this.useFilter = isSupported
  }
}
