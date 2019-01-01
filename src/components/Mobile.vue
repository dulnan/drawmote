<template>
  <div class="mobile h-100">
    <animation-wrapper v-if="!isConnected">
      <pairing />
    </animation-wrapper>

    <controlling v-if="isConnected" />
  </div>
</template>

<script>
import Pairing from '@/components/Mobile/Pairing.vue'
import AnimationWrapper from '@/components/Common/Animation/AnimationWrapper.vue'
import Controlling from '@/components/Mobile/Controlling.vue'

import { mapState } from 'vuex'
import { decodeEventMessage } from '@/tools/helpers'

export default {
  name: 'Mobile',

  components: {
    Pairing,
    AnimationWrapper,
    Controlling
  },

  computed: {
    ...mapState(['isConnected'])
  },

  methods: {
    handleConnected () {
      this.$store.dispatch('connect')
      this.$mote.start()
    },

    handleConnectionClosed () {
      this.$store.dispatch('disconnect')
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
  },

  beforeDestroy () {
    this.$peersox.off('peerConnected', this.handleConnected)
    this.$peersox.off('connectionClosed', this.handleConnectionClosed)

    this.$peersox.onString = () => {}
    this.$mote._onDataChange = () => {}
  }
}
</script>
