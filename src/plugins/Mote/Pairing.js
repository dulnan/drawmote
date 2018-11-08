export default class Pairing {
  constructor ({ code = '', hash = '', device = '' } = {}) {
    this.device = device
    this.hash = hash
    this.code = code
  }

  setDesktop () {
    this.device = 'desktop'
  }

  setMobile () {
    this.device = 'mobile'
  }

  toObject () {
    return {
      device: this.device,
      hash: this.hash,
      code: this.code
    }
  }

  toString () {
    return JSON.stringify(this.toObject())
  }
}
