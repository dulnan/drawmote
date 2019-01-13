<template>
  <div class="desktop relative">
    <div class="desktop-container relative overlay material">
      <animation-wrapper v-if="!isDrawing">
        <pairing
          :pairing="pairing"
          :is-blocked="isBlocked"
          @pairingTimeout="handleTimeout"
        />
      </animation-wrapper>
      <transition name="appear">
        <drawing v-if="isDrawing" />
      </transition>
    </div>
  </div>
</template>

<script>
import debouncedResize from 'debounced-resize'
import { mapState } from 'vuex'
import { BREAKPOINT_REMOTE, ANIMATION_SCREEN_VIEWPORT } from '@/settings'

import Pairing from '@/components/Desktop/Pairing.vue'
import AnimationWrapper from '@/components/Common/Animation/AnimationWrapper.vue'
import Drawing from '@/components/Desktop/Drawing.vue'
import { getViewportSize, encodeEventMessage } from '@/tools/helpers'

export default {
  name: 'Desktop',

  components: {
    Pairing,
    Drawing,
    AnimationWrapper
  },

  data () {
    return {
      pairing: {},
      isBlocked: false
    }
  },

  computed: {
    ...mapState(['isConnected', 'isSkipped']),

    hasPairing () {
      return this.pairing && this.pairing.code && this.pairing.hash
    },

    isDrawing () {
      return this.isConnected || this.isSkipped
    }
  },

  watch: {
    isConnected (isConnected) {
      if (!isConnected && !this.isSkipped) {
        this.pairing = {}
        this.getPairingCode()
      }
    },

    isSkipped (isSkipped) {
      if (isSkipped && this.$peersox.isConnected()) {
        this.$peersox.close()
      }
    }
  },

  methods: {
    animationEnter (el, done) {
      if (this.$refs.dynamic.$options.name === 'Animation') {
        this.$refs.dynamic.animate().finished.then(() => {
          done()
        })
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

    updateViewport () {
      let viewport = ANIMATION_SCREEN_VIEWPORT

      if (this.isConnected) {
        viewport = getViewportSize()
      }

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
      this.$store.dispatch('connect')

      this.updateViewport()
      this.$peersox.storePairing(pairing)
    },

    handleDisconnected () {
      this.$store.dispatch('disconnect')
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
