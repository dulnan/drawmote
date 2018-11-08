import axios from 'axios'

import Pairing from './Pairing'

import { getCookie, setCookie, eraseCookie } from '@/tools/helpers'

export default class PairingManager {
  constructor (serverUrl) {
    this.serverUrl = serverUrl
  }

  async getStoredPairing (cb) {
    const cookie = getCookie('pairing')

    if (cookie) {
      const pairing = JSON.parse(cookie)
      axios.post(this.serverUrl + '/pairing/validate', pairing).then((response) => {
        const isValid = response.data.isValid
        if (isValid) {
          cb(new Pairing(pairing))
        } else {
          this.deletePairing(pairing)
          cb()
        }
      })
    }
  }

  async requestPairing () {
    let response = false

    try {
      response = await axios.get(this.serverUrl + '/code/get')
    } catch (e) {
      console.log(e)
    }

    if (response) {
      return new Pairing({
        hash: response.data.hash,
        code: response.data.code,
        device: 'desktop'
      })
    }
  }

  async getHash (code) {
    const response = await axios.post(this.serverUrl + '/code/validate', {
      code: code
    })

    if (response.data.code && response.data.hash) {
      return {
        hash: response.data.hash,
        code: response.data.code
      }
    }

    return {}
  }

  savePairing (pairing) {
    setCookie('pairing', pairing.toString(), 1)
  }

  deletePairing () {
    eraseCookie('pairing')
  }
}
