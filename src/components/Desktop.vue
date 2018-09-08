<template>
  <div class="desktop relative">
    <div class="desktop-container relative overlay material">
      <transition name="appear">
        <pairing v-if="!isPaired" :code="pairingCode"></pairing>
      </transition>
      <drawing v-if="isPaired"></drawing>
      <the-footer />
      <connection />
    </div>
  </div>
</template>

<script>
import { EventBus } from '@/events'

import Pairing from '@/components/Desktop/Pairing.vue'
import Drawing from '@/components/Desktop/Drawing.vue'
import Connection from '@/components/Connection.vue'
import TheFooter from '@/components/Footer.vue'

export default {
  name: 'Desktop',

  components: {
    Pairing,
    Drawing,
    Connection,
    TheFooter
  },

  data () {
    return {
      pairingCode: '',
      isPaired: false
    }
  },

  mounted () {
    this.initConnection()

    EventBus.$on('isConnected', (isConnected) => {
      this.isPaired = isConnected
    })

    EventBus.$on('connectionClosed', () => {
      this.isPaired = true
    })
  },

  methods: {
    async initConnection () {
      const peering = await this.$connection.getPeeringCode()
      this.$connection.initPeering(peering.code, peering.hash)
      this.pairingCode = peering.code

      this.$connection.getStoredPeerings()
    }
  }
}
</script>

<style lang="scss">
.desktop {
  perspective: 700px;
  background: $color-greylight;
  padding: 2rem;
  height: 100vh;
}

.desktop-container {
  background: white;
}
</style>
