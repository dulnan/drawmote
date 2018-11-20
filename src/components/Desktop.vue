<template>
  <div class="desktop relative">
    <div class="desktop-container relative overlay material">
      <transition name="appear">
        <pairing
          v-if="!isPaired"
          :code="pairingCode"
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
import { getViewportSize } from '@/tools/helpers'

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
    getPairingCode () {
      this.$mote.getPairing().then(pairing => {
        if (pairing) {
          this.isBlocked = false
          this.$mote.connect(pairing)
          this.pairingCode = pairing.code
        } else {
          this.isBlocked = true
          this.pairingCode = '••••••'
        }
      })
    },

    skipPairing () {
      this.isPaired = true
    },

    updateViewport () {
      const viewport = getViewportSize()
      this.$vuetamin.store.mutate('updateViewport', viewport)
      this.$mote.sendViewport(viewport)

      if (!this.$mote.isConnected()) {
        this.isMobile = viewport.width < BREAKPOINT_REMOTE
      }
    },

    handleTimeout () {
      this.pairingCode = ''
      this.getPairingCode()
    },

    handleConnected () {
      this.isPaired = true

      const viewport = getViewportSize()
      this.$mote.sendViewport(viewport)
    },

    handleDisconnected () {
      this.isPaired = false
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

    this.$mote.on('connected', this.handleConnected)
    this.$mote.on('disconnected', this.handleDisconnected)
  },

  beforeDestroy () {
    this.$mote.off('connected', this.handleConnected)
    this.$mote.off('disconnected', this.handleDisconnected)
  }
}
</script>

<style lang="scss">
.desktop {
  perspective: 700px;
  height: 100%;
}
</style>
