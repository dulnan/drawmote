<template>
  <div class="desktop relative">
    <div class="desktop-container relative overlay material">
      <pairing
        v-if="!isDrawing"
        :pairing="pairing"
        :is-blocked="isBlocked"
        @pairingTimeout="handleTimeout"
        @skipPairing="skipPairing"
      />
      <transition
        appear
        v-on:appear="animationEnter"
        v-on:enter="animationEnter"
        v-on:leave="animationLeave"
        mode="out-in"
      >
        <component :is="isDrawing ? 'Drawing' : 'Animation'" ref="dynamic" />
      </transition>
    </div>
  </div>
</template>

<script>
import debouncedResize from 'debounced-resize'

import { BREAKPOINT_REMOTE } from '@/settings'

import Pairing from '@/components/Desktop/Pairing.vue'
import Animation from '@/components/Common/Animation.vue'
import Drawing from '@/components/Desktop/Drawing.vue'
import { getViewportSize, encodeEventMessage } from '@/tools/helpers'

export default {
  name: 'Desktop',

  components: {
    Pairing,
    Animation,
    Drawing
  },

  data () {
    return {
      pairing: {},
      isPaired: false,
      isBlocked: false,
      skipped: false
    }
  },

  computed: {
    hasPairing () {
      return this.pairing && this.pairing.code && this.pairing.hash
    },

    isDrawing () {
      return this.isPaired || this.skipped
    }
  },

  watch: {
    isPaired (isPaired) {
      if (!isPaired && !this.skipped) {
        this.pairing = {}
        this.getPairingCode()
      }
    }
  },

  methods: {
    animationEnter (el, done) {
      if (this.$refs.dynamic.$options.name === 'Animation') {
        this.$refs.dynamic.animate().finished.then(() => {
          done()
        })
      } else {
        done()
      }
    },
    animationLeave (el, done) {
      console.log(el)
      if (this.$refs.dynamic.$options.name === 'Animation') {
        this.$refs.dynamic.animateFullscreen().finished.then(() => {
          done()
        })
      } else {
        done()
      }
    },
    getPairingCode () {
      if (this.hasPairing) {
        return
      }

      if (this.$peersox.isConnected()) {
        this.$peersox.close()
      }

      this.$peersox.createPairing().then(pairing => {
        if (pairing) {
          this.isBlocked = false
          this.pairing = pairing
          this.$peersox.connect(pairing).catch(error => {
            console.log(error)
          })
        } else {
          this.isBlocked = true
          this.pairing = {}
        }
      }).catch(error => {
        console.log('Too many requests', error)
      })
    },

    skipPairing () {
      this.skipped = true
      this.isPaired = true
      this.pairing = {}

      if (this.$peersox.isConnected()) {
        this.$peersox.close()
      }
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

    handlePeerTimeout () {
      this.pairing = {}
    },

    handleConnected ({ pairing }) {
      this.isPaired = true

      this.updateViewport()
      this.$peersox.storePairing(pairing)
    },

    handleDisconnected () {
      if (!this.skipped) {
        this.isPaired = false
      }
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
    this.$peersox.on('peerTimeout', this.handlePeerTimeout)
    this.$peersox.on('connectionClosed', this.handleDisconnected)

    this.$peersox.onBinary = this.$mote.handleRemoteData.bind(this.$mote)
  },

  beforeDestroy () {
    this.$peersox.off('peerConnected', this.handleConnected)
    this.$peersox.off('peerTimeout', this.handlePeerTimeout)
    this.$peersox.off('connectionClosed', this.handleDisconnected)

    this.$peersox.onBinary = () => {}

    this.$peersox.close()
  }
}
</script>

<style lang="scss">
.desktop {
  height: 100%;
  overflow: hidden;
}
</style>
