import SocketPeer from 'socketpeer'
import axios from 'axios'

import { getCookie, setCookie, eraseCookie, parseDataString, buildDevServerUrl } from '@/tools/helpers'

function getServerUrl () {
  if (process.env.VUE_APP_API_URL) {
    return process.env.VUE_APP_API_URL
  } else {
    return buildDevServerUrl(window.location.hostname, '3000')
  }
}

const SERVER = getServerUrl()

export default class Connection {
  constructor (EventBus, DataHandler) {
    this.peer = null
    this.isDesktop = false
    this.hash = ''
    this.code = ''
    this.EventBus = EventBus
    this.DataHandler = DataHandler

    this._isConnected = false
  }

  isConnected () {
    return this._isConnected === true
  }

  async getStoredPeerings () {
    const cookie = getCookie('pairing')

    if (cookie) {
      const connection = JSON.parse(cookie)
      const isValid = await this.pairingIsValid(connection.pairing)

      if (isValid) {
        this.EventBus.$emit('connectionRestorable', connection.pairing)
      } else {
        this.deleteSession()
      }
    }
  }

  async getPeeringCode () {
    let response = false
    try {
      response = await axios.get(SERVER + '/code/get')
    } catch (e) {
      console.log(e)
    }

    if (response) {
      this.isDesktop = true

      return {
        hash: response.data.hash,
        code: response.data.code
      }
    }
  }

  async getPeeringHash (code) {
    const response = await axios.post(SERVER + '/code/validate', {
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

  async pairingIsValid (pairing) {
    const response = await axios.post(SERVER + '/pairing/validate', pairing)

    return response.data.isValid
  }

  saveSession (code, hash) {
    setCookie('pairing', JSON.stringify({
      pairing: {
        hash: hash,
        code: code
      },
      isDesktop: this.isDesktop
    }), 1)
  }

  deleteSession () {
    eraseCookie('pairing')
  }

  initPeering (code, hash) {
    this.peer = new SocketPeer({
      pairCode: hash,
      url: SERVER + '/socketpeer/',
      serveLibrary: false
    })

    this.peer.on('connect', () => {
      this.EventBus.$emit('isConnected', true)
      this._isConnected = true
      this.saveSession(code, hash)
    })

    this.peer.on('close', () => {
      this._isConnected = false
    })

    this.peer.on('connect_timeout', () => {
      this.EventBus.$emit('connectionTimeout')
    })

    this.peer.on('connect_error', () => {
      console.log('connect_error')
    })

    this.peer.on('error', (data) => {
      this._isConnected = false
      this.EventBus.$emit('connectionTimeout')
    })

    this.peer.on('data', (dataString) => {
      const data = JSON.parse(dataString)

      switch (data.name) {
        case 'Orientation':
          this.DataHandler.updateFromRemote(parseDataString(data.myData))
          break
        case 'OrientationOffset':
          this.DataHandler.updateCalibrationOffset(data.myData)
          break
        default:
          this.EventBus.$emit(data.name, data.myData)
      }
    })
  }

  emit (name, data) {
    if (!this._isConnected) {
      return
    }

    this.peer.send(JSON.stringify({
      name: name,
      myData: data
    }))
  }
}
