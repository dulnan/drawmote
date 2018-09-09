<template>
  <div class="browser-support">
    <h3 class="label">Browser Support</h3>
    <ul class="list check-list">
      <li class="check" v-for="check in doneChecks" :key="check.id" :class="{'supported': check.supported }">
        <div class="check__title">
          {{ $t(`browserSupport.${check.id}.label`) }}
        </div>
        <div class="check__notice" v-if="check.supported">{{ $t(`browserSupport.${check.id}.supported`) }}</div>
        <div class="check__notice" v-else>{{ $t(`browserSupport.${check.id}.notSupported`) }}</div>
      </li>
    </ul>
  </div>
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
      canvasFilter: null
    }
  },

  props: {
    checks: {
      type: String,
      default: 'desktop'
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

      if (this.checks === 'mobile') {
        this.gyroscope = await this.supportsGyroscope()
      }

      if (this.checks === 'desktop') {
        this.canvasFilter = this.supportsCanvasFilter()
      }
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
  h3 {
    text-transform: uppercase;
  }
}

.check-list {
  li:not(:last-child) {
    margin-bottom: 0.75rem;
  }
}

.check {
  font-size: .8125rem;
  line-height: 1.230769231;
}

.check__title {
  font-weight: 700;
  position: relative;
  &:before {
    content: "";
    display: block;
    width: 10px;
    height: 10px;
    margin-right: 3px;
    margin-top: 2px;
    border-radius: 100%;
    float: left;
    background: $color-red;
    .supported & {
      background: $color-green;
    }
  }
}
</style>
