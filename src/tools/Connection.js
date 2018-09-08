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

    this.isConnected = false
  }

  async getStoredPeerings () {
    const cookie = getCookie('pairing')

    if (cookie) {
      const data = JSON.parse(cookie)
      const peering = await this.getPeeringHash(parseInt(data.code))

      if (peering.isValid) {
        this.EventBus.$emit('connectionRestorable', peering)
      } else {
        this.deleteSession()
      }
    }
  }

  async getPeeringCode () {
    const response = await axios.get(SERVER + '/code/get')
    this.isDesktop = true

    return {
      hash: response.data.hash,
      code: response.data.code
    }
  }

  async getPeeringHash (code) {
    const response = await axios.post(SERVER + '/code/validate', {
      code: code
    })

    if (response.data.isValid) {
      return {
        isValid: true,
        hash: response.data.hash,
        code: response.data.code
      }
    }

    return {
      isValid: false
    }
  }

  saveSession (code, hash) {
    setCookie('pairing', JSON.stringify({
      hash: hash,
      code: code,
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
      console.log(this.peer)
      console.log('is connected')
      this.EventBus.$emit('isConnected', true)
      this.isConnected = true
      this.saveSession(code, hash)
    })

    this.peer.on('close', () => {
      console.log('closed')
      this.isConnected = false
      // this.EventBus.$emit('isConnected', true)
      // this.isConnected = true
      // this.saveSession()
    })

    this.peer.on('connect_timeout', () => {
      this.EventBus.$emit('connectionTimeout')
      console.log('connect_timeout')
    })

    this.peer.on('connect_error', () => {
      console.log('connect_error')
    })

    this.peer.on('error', (data) => {
      this.peer.close()
      this.isConnected = false
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
    if (!this.isConnected) {
      return
    }

    this.peer.send(JSON.stringify({
      name: name,
      myData: data
    }))
  }
}
