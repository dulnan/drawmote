<template>
  <div class="desktop relative">
    <div class="desktop-container relative overlay material">
      <transition name="component-fade">
        <component
          :is="visibleComponent"
          :is-desktop="true"
          :desktop-animation="desktopAnimation"
        >
          <Pairing
            :pairing="pairing"
            v-if="!isDrawing"
            :desktop-animation="desktopAnimation"
            @pairingTimeout="handleTimeout"
          />
        </component>
      </transition>
    </div>
  </div>
</template>

<script>
import debouncedResize from 'debounced-resize'
import { mapState } from 'vuex'
import { BREAKPOINT_REMOTE, ANIMATION_SCREEN_VIEWPORT } from '@/settings'

import Pairing from '@/components/Desktop/Pairing.vue'
import Animation from '@/components/Common/Animation/Animation.vue'
import Drawing from '@/components/Desktop/Drawing.vue'
import { getViewportSize, encodeEventMessage } from '@/tools/helpers'

export default {
  name: 'Desktop',

  components: {
    Pairing,
    Drawing,
    Animation
  },

  data() {
    return {
      pairing: {},
      viewportWidth: 700
    }
  },

  computed: {
    ...mapState(['isConnected', 'isSkipped']),

    visibleComponent() {
      return this.isDrawing ? 'Drawing' : 'Animation'
    },

    hasPairing() {
      return this.pairing && this.pairing.code && this.pairing.hash
    },

    isDrawing() {
      return this.isConnected || this.isSkipped
    },

    desktopAnimation() {
      return this.viewportWidth >= 1024
    }
  },

  watch: {
    isConnected(isConnected) {
      this.updateViewport()

      if (!isConnected && !this.isSkipped) {
        this.pairing = {}
        this.getPairingCode()
      }
    },

    isSkipped(isSkipped) {
      this.updateViewport()

      if (isSkipped && this.$peersox.isConnected()) {
        this.$peersox.close()
      }
    }
  },

  beforeMount() {
    this.viewportWidth = getViewportSize().width
  },

  mounted() {
    this.updateViewport()

    debouncedResize(() => {
      this.updateViewport()
    })

    if (!this.$settings.isPrerendering) {
      this.$peersox.on('serverReady', this.getPairingCode)
    }

    this.$peersox.on('peerConnected', this.handleConnected)
    this.$peersox.on('peerTimeout', this.handlePeerTimeout)
    this.$peersox.on('connectionClosed', this.handleDisconnected)

    this.$peersox.onBinary = this.$mote.handleRemoteData.bind(this.$mote)
  },

  beforeDestroy() {
    this.$peersox.off('serverReady', this.getPairingCode)
    this.$peersox.off('peerConnected', this.handleConnected)
    this.$peersox.off('peerTimeout', this.handlePeerTimeout)
    this.$peersox.off('connectionClosed', this.handleDisconnected)

    this.$peersox.onBinary = () => {}

    this.$peersox.close()
  },

  methods: {
    getPairingCode() {
      if (this.hasPairing) {
        return
      }

      if (this.$peersox.isConnected()) {
        this.$peersox.close()
      }

      this.$peersox
        .createPairing()
        .then(pairing => {
          if (pairing) {
            this.pairing = pairing
            this.$peersox.connect(pairing).catch(error => {
              this.$store.commit('setServerStatus', error)
              this.$sentry.logInfo('pairing', 'connect:failed')
            })
          } else {
            this.pairing = {}
            this.$sentry.logInfo('pairing', 'create:failed')
          }
          this.$store.commit('setServerStatus')
        })
        .catch(error => {
          this.$store.commit('setServerStatus', error)
          this.$sentry.logInfo('pairing', 'create:failed')
        })
    },

    updateViewport() {
      let viewport = ANIMATION_SCREEN_VIEWPORT

      if (this.isConnected || this.isSkipped) {
        viewport = getViewportSize()
      }

      this.$vuetamin.store.mutate('updateViewport', viewport)
      this.$peersox.send(encodeEventMessage('viewport', viewport))

      if (!this.$peersox.isConnected()) {
        this.isMobile = viewport.width < BREAKPOINT_REMOTE
      }

      this.$sentry.logInfo('viewport', JSON.stringify(viewport))
    },

    handleTimeout() {
      this.pairing = {}
      this.getPairingCode()
    },

    handlePeerTimeout() {
      this.pairing = {}
    },

    handleConnected({ pairing }) {
      this.$store.dispatch('connect')

      this.updateViewport()
      this.$peersox.storePairing(pairing)
      this.$sentry.setUser(pairing.hash)
    },

    handleDisconnected() {
      this.$store.dispatch('disconnect')
    },

    handleBinary(intArray) {
      this.$mote.handleRemoteData(intArray)
    }
  }
}
</script>

<style lang="scss">
.desktop {
  height: 100%;
  overflow: hidden;
}
</style>
