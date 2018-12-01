<template>
  <div class="desktop relative">
    <div class="desktop-container relative overlay material">
      <transition name="appear">
        <pairing
          v-if="!isPaired"
          :pairing="pairing"
          :is-blocked="isBlocked"
          @pairingTimeout="handleTimeout"
          @skipPairing="skipPairing"
        />
      </transition>
      <drawing v-if="isPaired"></drawing>
    </div>
  </div>
</template>

<script>
import debouncedResize from 'debounced-resize'

import { BREAKPOINT_REMOTE } from '@/settings'

import Pairing from '@/components/Desktop/Pairing.vue'
import { getViewportSize, encodeEventMessage } from '@/tools/helpers'

export default {
  name: 'Desktop',

  components: {
    Pairing,
    'drawing': () => import('@/components/Desktop/Drawing.vue')
  },

  data () {
    return {
      pairing: {},
      isPaired: false,
      isBlocked: false
    }
  },

  computed: {
    hasPairing () {
      return this.pairing && this.pairing.code && this.pairing.hash
    }
  },

  methods: {
    getPairingCode () {
      if (this.hasPairing) {
        return
      }

      this.$peersox.initiate().then(pairing => {
        if (pairing) {
          this.isBlocked = false
          this.pairing = pairing
        } else {
          this.isBlocked = true
          this.pairing = {}
        }
      })
    },

    skipPairing () {
      this.isPaired = true
    },

    updateViewport () {
      const viewport = getViewportSize()

      this.$vuetamin.store.mutate('updateViewport', viewport)
      this.$peersox.send(encodeEventMessage('viewport', viewport))

      if (!this.$peersox.isConnected()) {
        this.isMobile = viewport.width < BREAKPOINT_REMOTE
      }
    },

    handleTimeout () {
      this.pairing = {}
      this.getPairingCode()
    },

    handleConnected ({ pairing }) {
      this.isPaired = true

      this.updateViewport()
      this.$mote.init()
      this.$peersox.storePairing(pairing)
    },

    handleDisconnected () {
      this.isPaired = false
    },

    handleBinary (intArray) {
      this.$mote.handleRemoteData(intArray)
    }
  },

  mounted () {
    this.updateViewport()

    debouncedResize((e) => {
      this.updateViewport()
    })

    if (!this.$settings.isPrerendering) {
      this.getPairingCode()
    }

    this.$peersox.on('peerConnected', this.handleConnected)
    this.$peersox.on('connectionClosed', this.handleDisconnected)

    this.$peersox.onBinary = this.$mote.handleRemoteData.bind(this.$mote)
  },

  beforeDestroy () {
    this.$peersox.off('peerConnected', this.handleConnected)
    this.$peersox.off('connectionClosed', this.handleDisconnected)

    this.$peersox.onBinary = () => {}

    this.$peersox.close()
  }
}
</script>

<style lang="scss">
.desktop {
  perspective: 700px;
  height: 100%;
}
</style>
