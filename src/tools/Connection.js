import SocketPeer from 'socketpeer'
import axios from 'axios'

import { getCookie, setCookie, parseDataString } from '@/tools/helpers'

const SERVER = 'http://172.20.10.7:3000'

export default class Connection {
  constructor (EventBus, DataHandler) {
    this.peer = null
    this.isDesktop = false
    this.hash = ''
    this.code = ''
    this.EventBus = EventBus
    this.DataHandler = DataHandler

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
      this.saveSession()
    })

    this.peer.on('data', (data) => {
      switch (data.name) {
        case 'Orientation':
          this.DataHandler.update(parseDataString(data.data))
          break
        case 'OrientationOffset':
          this.DataHandler.updateCalibrationOffset(data.data)
          break
        default:
          this.EventBus.$emit(data.name, data.data)
      }
    })
  }

  emit (name, data) {
    this.peer.send({
      name: name,
      data: data
    })
  }
}
