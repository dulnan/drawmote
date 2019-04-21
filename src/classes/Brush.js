import {
  DEFAULT_COLOR,
  RADIUS_DEFAULT,
  HARDNESS_DEFAULT,
  OPACITY_DEFAULT
} from '@/settings'

import Color from '@/classes/Color'

export default class Brush {
  constructor({
    color = DEFAULT_COLOR,
    radius = RADIUS_DEFAULT,
    hardness = HARDNESS_DEFAULT,
    opacity = OPACITY_DEFAULT
  } = {}) {
    this.color = new Color(color)
    this.radius = radius
    this.hardness = hardness
    this.opacity = opacity
    this.style = 'smudge'

    this.useFilter = false
  }

  /**
   * Return the current brush state. This can be used to instanciate a
   * new Brush later.
   *
   * @returns {Object} The brush properties.
   */
  get state() {
    return {
      color: this.color,
      radius: this.radius,
      hardness: this.hardness,
      opacity: this.opacity,
      style: this.style
    }
  }

  /**
   * Calculate and return the brush radius based on the amount
   * of bluriness is used.
   *
   * @returns {Number} The radius in pixels.
   */
  get canvasRadius() {
    if (!this.useFilter) {
      return this.radius
    }
    return (this.hardness / 100 + 1) * this.radius
  }

  /**
   * Calculate and return the blur amount for canvas filters.
   *
   * @returns {Number} The blur amount in pixels.
   */
  get canvasBlur() {
    return (1 - this.hardness / 100) * this.radius
  }

  /**
   * Return the brush color as a string to be used for canvas values.
   *
   * @returns {String} The color as a rgba string.
   */
  get canvasColor() {
    return this.color.getRgbaString(this.opacity)
  }

  /**
   * Returns the canvas properties required to draw with this brush.
   *
   * @returns {Object}
   */
  get canvasProperties() {
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

  /**
   * Sets the brush color.
   *
   * @param {Color} color The new color.
   */
  setColor(color) {
    this.color = color
  }

  /**
   * Sets the brush radius.
   *
   * @param {Number} radius The new radius.
   */
  setRadius(radius) {
    this.radius = radius
  }

  /**
   * Sets the brush hardness.
   *
   * @param {Number} hardness The new hardness.
   */
  setHardness(hardness) {
    this.hardness = hardness
  }

  /**
   * Sets the brush opacity.
   *
   * @param {Number} opacity The new opacity.
   */
  setOpacity(opacity) {
    this.opacity = opacity
  }

  /**
   * Sets the brush style.
   *
   * @param {String} style The new style.
   */
  setStyle(style) {
    this.style = style
  }

  /**
   * Sets the flag to use canvas filters or not.
   *
   * @param {Boolean} isSupported Whether canvas filters are supported.
   */
  setFilterSupport(isSupported) {
    this.useFilter = isSupported
  }
}
