<template>
  <transition name="appear">
    <div class="browser-support" :class="{ 'done': done }">
      <div class="browser-support__content pdg relative">
        <button class="btn btn--bare browser-support__close" @click="$emit('close')">
          <div class="pdg">
            <icon-close class="icon block" />
          </div>
        </button>
        <h3 class="label">{{ $t('browserSupport.title') }}</h3>
        <ul class="list check-list">
          <li class="check check--small" v-for="check in doneChecks" :key="check.id" :class="check.state">
            <div class="check__title">
              {{ $t(`browserSupport.${check.id}.label`) }}
            </div>
            <div class="check__notice">{{ $t(`browserSupport.${check.id}.${check.state}`) }}</div>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
import IconClose from '@/assets/icons/icon-close.svg'

import GyroNorm from 'gyronorm'
require('@hughsk/fulltilt/dist/fulltilt.min.js')

const simplePeer = require('simple-peer')

export default {
  name: 'BrowserSupport',

  components: {
    IconClose
  },

  data () {
    return {
      webRTC: null,
      webSocket: null,
      gyroscope: null,
      canvasFilter: null,
      done: false
    }
  },

  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    doneChecks () {
      const checks = ['webRTC', 'webSocket', 'gyroscope', 'canvasFilter']
      return checks.filter(c => this[c] !== null).map(c => {
        return {
          id: c,
          state: this[c] === true ? 'supported' : 'unsupported'
        }
      })
    }
  },

  methods: {
    supportsCanvasFilter () {
      const ctx = document.createElement('canvas').getContext('2d')
      return typeof ctx.filter !== 'undefined'
    },

    supportsWebRTC () {
      return simplePeer.WEBRTC_SUPPORT
    },

    supportsWebSocket () {
      return 'WebSocket' in window || 'MozWebSocket' in window
    },

    supportsGyroscope () {
      return new Promise(async (resolve, reject) => {
        const gn = new GyroNorm()

        gn.init().then(() => {
          const isAvailable = gn.isAvailable()
          resolve(isAvailable.deviceOrientationAvailable)
        }).catch((e) => {
          resolve(false)
        })
      })
    },

    async check () {
      this.webRTC = this.supportsWebRTC()
      this.webSocket = this.webRTC ? null : this.supportsWebSocket()

      this.$track('BrowserSupport', 'webrtc', this.webRTC)
      this.$track('BrowserSupport', 'websocket', this.webSocket)

      if (this.isMobile) {
        this.gyroscope = await this.supportsGyroscope()
        this.$track('BrowserSupport', 'gyroscope', this.gyroscope)
      }

      if (!this.isMobile) {
        this.canvasFilter = this.supportsCanvasFilter()
        this.$track('BrowserSupport', 'canvasfilter', this.canvasFilter)
      }

      let supportState = 'supported'

      if ((this.webRTC === false && this.webSocket === true) || this.canvasFilter === false) {
        supportState = 'partial'
      }

      if (this.webSocket === false || this.gyroscope === false) {
        supportState = 'unsupported'
      }

      this.$emit('supportState', supportState)

      this.$track('BrowserSupport', 'supportstate', supportState)

      this.done = true

      this.$vuetamin.store.mutate('updateCanvasFilterSupport', this.canvasFilter)
    }
  },

  mounted () {
    this.check()
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/components/_check.scss';

.browser-support {
  display: block;
  text-align: left;
  position: absolute;
  bottom: 100%;
  left: 0;
  width: calc(100% + 1px);
  border: $list-separator-style;
  border-width: 1px 1px 0 0;
  z-index: -1;
  background: white;

  &.appear-enter-active, &.appear-leave-active {
    transition: .5s;
    .browser-support__content {
      transition: .2s;
      transition-delay: 0.3s;
    }
  }
  &.appear-enter, &.appear-leave-to {
    transform: translateY(100%);
    .browser-support__content {
      opacity: 0;
    }
  }
  h3 {
    text-transform: uppercase;
  }
}

.browser-support__close {
  position: absolute;
  top: 0;
  right: 0;
  svg {

  }
}

.browser-support__content {
  background: white;
}

.check-list {
  li:not(:last-child) {
    margin-bottom: 0.75rem;
  }
}
</style>
