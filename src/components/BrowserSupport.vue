<template>
  <transition name="appear">
    <div class="browser-support pdg" :class="{ 'done': done }">
      <div class="browser-support__content pdg">
        <h3 class="label">Browser Support</h3>
        <ul class="list check-list">
          <li class="check check--small" v-for="check in doneChecks" :key="check.id" :class="{ 'not-supported': !check.supported, 'supported': check.supported }">
            <div class="check__title">
              {{ $t(`browserSupport.${check.id}.label`) }}
            </div>
            <div class="check__notice" v-if="check.supported">{{ $t(`browserSupport.${check.id}.supported`) }}</div>
            <div class="check__notice" v-else>{{ $t(`browserSupport.${check.id}.notSupported`) }}</div>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
import GyroNorm from 'gyronorm'
require('@hughsk/fulltilt/dist/fulltilt.min.js')

const simplePeer = require('simple-peer')

export default {
  name: 'BrowserSupport',

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
          supported: this[c] === true
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

      if (this.isMobile) {
        this.gyroscope = await this.supportsGyroscope()
      }

      if (!this.isMobile) {
        this.canvasFilter = this.supportsCanvasFilter()
      }

      if (this.webRTC === false || this.webSocket === false || this.gyroscope === false || this.canvasFilter === false) {
        this.$emit('notSupported')
      }

      this.done = true
    }
  },

  mounted () {
    this.check()
  }
}
</script>

<style lang="scss">
.browser-support {
  display: block;
  text-align: left;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  transform: translateY(-100%);
  &.appear-enter-active, &.appear-leave-active {
    transition: .5s;
  }
  &.appear-enter, &.appear-leave-to {
    opacity: 0;
    transform: translateY(-100%) translateY(2rem);
  }
  h3 {
    text-transform: uppercase;
  }
}

.browser-support__content {
  background: white;
  border-radius: $border-radius-default;
  box-shadow: $shadow-s;
}

.check-list {
  li:not(:last-child) {
    margin-bottom: 0.75rem;
  }
}
</style>
