<template>
  <div class="desktop relative">
    <div class="desktop-container relative overlay material">
      <transition name="appear">
        <pairing
          v-if="!isPaired"
          :code="pairingCode"
          :is-blocked="isBlocked"
          @pairingTimeout="handleTimeout"
        />
      </transition>
      <drawing v-if="isPaired"></drawing>
    </div>
  </div>
</template>

<script>
import { EventBus } from '@/events'

import Pairing from '@/components/Desktop/Pairing.vue'

let timeout = null

export default {
  name: 'Desktop',

  components: {
    Pairing,
    'drawing': () => import('@/components/Desktop/Drawing.vue')
  },

  data () {
    return {
      pairingCode: '',
      isPaired: false,
      isBlocked: false
    }
  },

  mounted () {
    if (timeout) {
      window.clearTimeout(timeout)
    }
    timeout = window.setTimeout(() => {
      this.getPairingCode()
      this.$connection.getStoredPeerings()
    }, 500)

    EventBus.$on('isConnected', (isConnected) => {
      this.isPaired = isConnected
    })

    EventBus.$on('connectionClosed', () => {
      this.isPaired = true
    })
  },

  methods: {
    async getPairingCode () {
      const peering = await this.$connection.getPeeringCode()

      if (peering) {
        this.isBlocked = false
        this.$connection.initPeering(peering.code, peering.hash)
        this.pairingCode = peering.code
      } else {
        this.isBlocked = true
        this.pairingCode = '••••••'
      }
    },

    handleTimeout () {
      this.pairingCode = ''
      this.getPairingCode()
    }
  }
}
</script>

<style lang="scss">
.desktop {
  perspective: 700px;
  height: 100%;
}
</style>
