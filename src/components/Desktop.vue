<template>
  <div class="desktop relative">
    <div class="desktop-container relative overlay material">
      <transition name="appear">
        <pairing
          v-if="!isPaired"
          :code="pairingCode"
          :is-blocked="isBlocked"
          @pairingTimeout="handleTimeout"
          @skipPairing="isPaired = true"
        />
      </transition>
      <drawing v-if="isPaired"></drawing>
    </div>
  </div>
</template>

<script>
import Pairing from '@/components/Desktop/Pairing.vue'

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

  methods: {
    async getPairingCode () {
      const pairing = await this.$mote.getPairing()

      if (pairing) {
        this.isBlocked = false
        this.$mote.initPairing(pairing)
        this.pairingCode = pairing.code
      } else {
        this.isBlocked = true
        this.pairingCode = '••••••'
      }
    },

    handleTimeout () {
      this.pairingCode = ''
      this.getPairingCode()
    },

    handleConnected () {
      this.isPaired = true
    }
  },

  mounted () {
    if (!this.$settings.isPrerendering) {
      this.getPairingCode()
    }

    this.$mote.on('connected', this.handleConnected)
  },

  beforeDestroy () {
    this.$mote.off('connected', this.handleConnected)
  }
}
</script>

<style lang="scss">
.desktop {
  perspective: 700px;
  height: 100%;
}
</style>
