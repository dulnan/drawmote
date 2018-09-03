import SocketPeer from 'socketpeer'
import axios from 'axios'

import { getCookie, setCookie, parseDataString } from '@/tools/helpers'

const SERVER = `http://${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`

export default class Connection {
  constructor (EventBus, DataHandler) {
    this.peer = null
    this.isDesktop = false
    this.hash = ''
    this.code = ''
    this.EventBus = EventBus
    this.DataHandler = DataHandler

    this.isConnected = false

    this.init()
  }

  init () {
    const cookie = getCookie('pairing')

    if (cookie) {
      this.hash = cookie.hash
      this.initPeering()
    }
  }

  async registerDesktop () {
    const response = await axios.get(SERVER + '/code/get')

    this.hash = response.data.hash
    this.code = response.data.code
    this.isDesktop = true

    return response.data.code
  }

  async validateCode (code) {
    const response = await axios.post(SERVER + '/code/validate', {
      code: code
    })

    if (response.data.isValid) {
      this.hash = response.data.hash
      this.code = response.data.code

      return true
    }

    return false
  }

  saveSession () {
    setCookie('pairing', {
      hash: this.hash,
      isDesktop: this.isDesktop
    }, 1)
  }

  initPeering () {
    this.peer = new SocketPeer({
      pairCode: this.hash,
      url: SERVER + '/socketpeer/'
    })

    this.peer.on('connect', () => {
      this.EventBus.$emit('isConnected', true)
      this.isConnected = true
      this.saveSession()
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
