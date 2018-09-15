export default class Smoothing {
  constructor () {
    this.prev = 0

    this.smoothing = 0.08
  }

  next (input) {
    const value = this.prev + this.smoothing * (input - this.prev)
    this.prev = value

    return value
  }
}
