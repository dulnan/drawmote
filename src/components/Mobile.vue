<template>
  <div class="mobile h-100">
    <transition name="appear">
      <pairing v-if="!isConnected"></pairing>
    </transition>
    <transition name="appear">
      <controlling v-if="isConnected"></controlling>
    </transition>
  </div>
</template>

<script>
import Pairing from '@/components/Mobile/Pairing.vue'
import Controlling from '@/components/Mobile/Controlling.vue'

import { encodeEventMessage, decodeEventMessage } from '@/tools/helpers'

export default {
  name: 'Mobile',

  components: {
    Pairing,
    Controlling
  },

  data () {
    return {
      isConnected: false
    }
  },

  methods: {
    handleConnected () {
      this.isConnected = true
      this.$mote.start()
    },

    handleConnectionClosed () {
      console.log('handddd')
      this.isConnected = false
      this.$mote.stop()
    },

    handleMessage (rawMessage) {
      const { event, data } = decodeEventMessage(rawMessage)

      if (event === 'viewport') {
        this.$mote.updateScreenViewport(data)
        return
      }

      if (event === 'distance') {
        this.$mote.updateScreenDistance(data)
        return
      }
    },

    handleDataChange (data) {
      this.$peersox.send(data)
    }
  },

  mounted () {
    this.$peersox.on('peerConnected', this.handleConnected)
    this.$peersox.on('connectionClosed', this.handleConnectionClosed)

    this.$peersox.onString = this.handleMessage.bind(this)
    this.$mote._onDataChange = this.handleDataChange.bind(this)
  },

  beforeDestroy () {
    this.$peersox.off('peerConnected', this.handleConnected)
    this.$peersox.off('connectionClosed', this.handleConnectionClosed)

    this.$peersox.onString = () => {}
    this.$mote._onDataChange = () => {}
  }
}
</script>
