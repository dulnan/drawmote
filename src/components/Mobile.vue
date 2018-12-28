<template>
  <div class="mobile h-100">
    <animation-mobile>
      <pairing v-if="!isConnected"></pairing>
    </animation-mobile>
    <transition name="appear">
      <controlling v-if="isConnected"></controlling>
    </transition>
  </div>
</template>

<script>
import Pairing from '@/components/Mobile/Pairing.vue'
import AnimationMobile from '@/components/Common/Animation/AnimationMobile.vue'
import Controlling from '@/components/Mobile/Controlling.vue'

import { decodeEventMessage } from '@/tools/helpers'

export default {
  name: 'Mobile',

  components: {
    Pairing,
    AnimationMobile,
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
      this.isConnected = false
      this.$mote.stop()
    },

    handleMessage (rawMessage) {
      const { event, data } = decodeEventMessage(rawMessage)

      if (event === 'viewport') {
        this.$mote.updateScreenViewport(data)
      }

      if (event === 'distance') {
        this.$mote.updateScreenDistance(data)
      }
    },

    handleDataChange (data) {
      this.$peersox.send(data)
    }
  },

  mounted () {
    this.$peersox.on('peerConnected', this.handleConnected.bind(this))
    this.$peersox.on('connectionClosed', this.handleConnectionClosed.bind(this))

    this.$peersox.onString = this.handleMessage.bind(this)
    this.$mote._onDataChange = this.handleDataChange.bind(this)

    console.log(this.$mote)
  },

  beforeDestroy () {
    this.$peersox.off('peerConnected', this.handleConnected)
    this.$peersox.off('connectionClosed', this.handleConnectionClosed)

    this.$peersox.onString = () => {}
    this.$mote._onDataChange = () => {}
  }
}
</script>
