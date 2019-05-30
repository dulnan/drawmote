<template>
  <div id="drawmote" class="relative" :class="{ 'is-ready': isReady }">
    <Mobile v-if="isMobile" />
    <Desktop v-else />
    <RestoreConnection />
    <TheFooter :is-mobile="isMobile" />
    <ConnectionTimeout :is-mobile="isMobile" />
    <transition name="appear">
      <Attribution v-if="attributionVisible" />
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PeerSox from 'peersox'

import { BREAKPOINT_REMOTE } from '@/settings'
import Desktop from '@/components/Desktop.vue'
import Mobile from '@/components/Mobile.vue'
import TheFooter from '@/components/Common/Footer/Footer.vue'
import RestoreConnection from '@/components/Common/RestoreConnection.vue'
import ConnectionTimeout from '@/components/Common/ConnectionTimeout.vue'
import Attribution from '@/components/Common/Attribution.vue'

let peersoxHandlers = []

export default {
  name: 'App',

  components: {
    Desktop,
    Mobile,
    TheFooter,
    RestoreConnection,
    ConnectionTimeout,
    Attribution
  },

  data() {
    return {
      isMobile: true,
      isReady: false
    }
  },

  computed: {
    ...mapState(['attributionVisible'])
  },

  beforeMount() {
    this.isMobile = window.innerWidth < BREAKPOINT_REMOTE
  },

  mounted() {
    this.$nextTick(() => {
      if (!window.__PRERENDERING) {
        peersoxHandlers = new Array(
          PeerSox.EVENT_SERVER_READY,
          PeerSox.EVENT_CONNECTION_ESTABLISHED,
          PeerSox.EVENT_CONNECTION_CLOSED,
          PeerSox.EVENT_PEER_CONNECTED,
          PeerSox.EVENT_PEER_TIMEOUT,
          PeerSox.EVENT_PEER_WEBRTC_CLOSED
        ).map(event => {
          const fn = () => {
            this.$sentry.logInfo('peersox', event)
          }

          this.$peersox.on(event, fn)

          return {
            event,
            fn
          }
        })
        this.isReady = true
      }

      document.dispatchEvent(new Event('render-event'))
      this.$forceUpdate()

      this.$peersox.init().catch(e => {
        this.$store.commit('setServerStatus', e)
      })

      const mode = this.isMobile ? 'mobile' : 'desktop'
      this.$sentry.setMode(mode)
    })
  },

  beforeDestroy() {
    peersoxHandlers.forEach(handler => {
      this.$peersox.off(handler.event, handler.fn)
    })
  }
}
</script>

<style lang="scss">
#drawmote {
  background: $alt-color-darker;
  opacity: 0;
  transition: 0.9s;
  &.is-ready {
    opacity: 1;
  }
  @include media('sm') {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    overflow: hidden;
  }
}
</style>
