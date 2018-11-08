import SocketPeer from 'socketpeer'
import EventEmitter from 'eventemitter3'

import { parseDataString } from '@/tools/helpers'

import { GyroPlane } from 'gyro-plane'
import { LazyBrush } from 'lazy-brush'

import PairingManager from './PairingManager'

class Mote extends EventEmitter {
  constructor (serverUrl) {
    super()

    this.serverUrl = serverUrl

    this.pairingManager = new PairingManager(serverUrl)

    this.peer = new SocketPeer({
      autoconnect: false,
      url: this.serverUrl + '/socketpeer/',
      serveLibrary: false
    })

    this.gyro = new GyroPlane()
    this.lazy = new LazyBrush({
      radius: 5,
      enabled: false
    })

    this.isPressing = false

    this.pairing = null

    this._isConnected = false

    this.initSocketPeer()
  }

  initSocketPeer () {
    this.peer.on('connect', () => {
      this.emit('connected', this.pairing)
      this._isConnected = true
      this.pairingManager.savePairing(this.pairing)
    })

    this.peer.on('close', () => {
      this._isConnected = false
    })

    this.peer.on('connect_timeout', () => this.emit('connectionTimeout'))

    // this.peer.on('connect_error', () => {
    //   console.log('connect_error')
    // })

    this.peer.on('error', (data) => {
      this._isConnected = false
      this.emit('connectionTimeout')
    })

    this.peer.on('data', (messageString) => {
      const message = JSON.parse(messageString)

      switch (message.name) {
        case 'Orientation':
          const data = parseDataString(message.data)

          this.gyro.updateOrientation(data)
          const coordinates = this.gyro.getScreenCoordinates()
          const hasChanged = this.lazy.update(coordinates)
          if (hasChanged) {
            this.emit('pointermove', coordinates)
          }

          if (data.isPressingMain !== this.isPressing) {
            this.isPressing = data.isPressingMain

            if (data.isPressingMain) {
              this.emit('pointerdown')
            } else {
              this.emit('pointerup')
            }
          }

          this.emit('slide', data.touchDiffY)
          break
        case 'OrientationOffset':
          this.gyro.updateOffset(message.data)
          this.emit('calibrated', message.data)
          break
      }
    })
  }

  async getPairing () {
    const pairing = await this.pairingManager.requestPairing()
    return pairing
  }

  async getPairingByCode (code) {
    const pairing = await this.pairingManager.getHash(code)
    return pairing
  }

  loadStoredPairings () {
    this.pairingManager.getStoredPairing((pairing) => {
      if (pairing) {
        this.emit('restorable', pairing)
      }
    })
  }

  deleteStoredPairing (pairing) {
    this.pairingManager.deletePairing(pairing)
  }

  isConnected () {
    return this._isConnected
  }

  initPairing (pairing) {
    this.pairing = pairing

    this.peer.pairCode = pairing.hash

    this.peer.connect()
  }

  send (name, data) {
    if (!this.isConnected()) {
      return
    }

    this.peer.send(JSON.stringify({
      name: name,
      data: data
    }))
  }
}

export default {
  install (Vue, { serverUrl }) {
    Vue.prototype.$mote = new Mote(serverUrl)
  }
}
