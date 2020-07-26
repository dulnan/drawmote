<template lang="html">
  <transition name="appear">
    <div class="browser-support" :class="{ done: allDone }">
      <div class="browser-support__content pdg relative">
        <template v-if="!needsPermission">
          <button
            class="btn btn--bare browser-support__close"
            @click="$emit('close')"
          >
            <div class="pdg">
              <IconClose class="icon block" />
            </div>
          </button>
          <h3 class="label">{{ $t('browserSupport.title') }}</h3>
          <ul class="list check-list">
            <li
              v-for="check in doneChecks"
              :key="check.check"
              class="check check--small"
              :class="check.state"
            >
              <div class="check__title">
                {{ $t(`browserSupport.${check.check}.label`) }}
              </div>
              <div class="check__notice">
                {{ $t(`browserSupport.${check.check}.${check.state}`) }}
              </div>
            </li>
          </ul>
        </template>

        <div v-if="needsPermission">
          <p class="h3">
            {{ $t('browserSupport.requestPermission.text') }}
          </p>
          <button
            class="btn btn--default btn--block mrgt"
            @click="requestPermission"
          >
            {{ $t('browserSupport.requestPermission.cta') }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import IconClose from '@/assets/icons/icon-close.svg'

const CHECKS = ['webRTC', 'webSocket', 'gyroscope', 'canvasFilter']
let watchers = []

const SUPPORT_STATE = {
  SUPPORTED: 'supported',
  UNSUPPORTED: 'unsupported',
  PARTIAL: 'partial',
  CHECKING: 'checking'
}

const CHECK_STATE = {
  TRUE: 'supported',
  FALSE: 'unsupported',
  NOT_REQUIRED: 'not_required',
  WAITING: 'waiting',
  CHECKING: 'checking'
}

function getCheckStateFromBoolean(isSupported) {
  return isSupported ? CHECK_STATE.TRUE : CHECK_STATE.FALSE
}

function filterRelevantCheck(check) {
  return check !== CHECK_STATE.CHECKING && check !== CHECK_STATE.NOT_REQUIRED
}

export default {
  name: 'BrowserSupport',

  components: {
    IconClose
  },

  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },

  data() {
    let data = {
      needsPermission: false
    }

    CHECKS.forEach((check) => {
      data[check] = CHECK_STATE.CHECKING
    })

    return data
  },

  computed: {
    /**
     * @returns {Array} Return the checks with their support status.
     */
    doneChecks() {
      return this.relevantChecks.map((check) => {
        return {
          check: check,
          state: this[check]
        }
      })
    },

    relevantChecks() {
      return CHECKS.filter((check) => filterRelevantCheck(this[check]))
    },

    allDone() {
      return this.relevantChecks.length === this.doneChecks.length
    },

    supportState() {
      if (!this.allDone) {
        return SUPPORT_STATE.CHECKING
      }

      if (
        (this.webRTC === CHECK_STATE.FALSE &&
          this.webSocket === CHECK_STATE.FALSE) ||
        (this.isMobile && this.gyroscope === CHECK_STATE.FALSE)
      ) {
        return SUPPORT_STATE.UNSUPPORTED
      }

      if (
        this.relevantChecks.filter((check) => this[check] === CHECK_STATE.FALSE)
          .length > 0
      ) {
        return SUPPORT_STATE.PARTIAL
      }

      if (this.needsPermission) {
        return SUPPORT_STATE.PARTIAL
      }

      return SUPPORT_STATE.SUPPORTED
    }
  },

  watch: {
    supportState(state) {
      this.$emit('supportState', state)
    }
  },

  mounted() {
    if (!this.$settings.isPrerendering) {
      this.$emit('supportState', this.supportState)

      watchers = CHECKS.map((check) => {
        return this.$watch(check, (checkState) => {
          this.$sentry.setSupport(check, checkState)
        })
      })

      this.runCheck()

      this.$peersox.on('usingFallback', () => {
        this.webRTC = CHECK_STATE.FALSE
      })
    }
  },

  beforeDestroy() {
    watchers.forEach((watcher) => watcher())
  },

  methods: {
    /**
     * Checks if canvas filters are supported. This is needed for the hardness
     * property of the brush.
     */
    supportsCanvasFilter() {
      const ctx = document.createElement('canvas').getContext('2d')
      return getCheckStateFromBoolean(typeof ctx.filter !== 'undefined')
    },

    /**
     * Checks if WebSockets are supported.
     */
    supportsWebSocket() {
      return getCheckStateFromBoolean(
        this.$peersox.getDeviceSupport().WEBSOCKET
      )
    },

    /**
     * Checks if WebRTC is supported.
     */
    supportsWebRTC() {
      return getCheckStateFromBoolean(this.$peersox.getDeviceSupport().WEBRTC)
    },

    /**
     * Checks if the device has a gyroscope.
     */
    supportsGyroscope() {
      return this.$mote.deviceHasGyroscope().then(getCheckStateFromBoolean)
    },

    /**
     * Asynchronously run the checks. Issue tracking events, supportState event
     * and modify the Vuetamin store if canvas filters are supported.
     */
    runCheck() {
      this.webRTC = this.supportsWebRTC()
      this.webSocket = this.supportsWebSocket()

      // Checks gyroscope availability.
      if (this.isMobile) {
        if (this.$mote.gyroscope.needsPermission()) {
          this.needsPermission = true
        } else {
          this.supportsGyroscope().then((hasGyroscope) => {
            this.gyroscope = hasGyroscope
          })
          this.$mote.gyroscope.initGyroNorm()
        }
      } else {
        this.gyroscope = CHECK_STATE.NOT_REQUIRED
      }

      // Checks if canvas filter is available. For mobile this is only relevant
      // for the demo inside the 3D screen, that's why the user does not need to
      // be informed about that. It is set however in the Vuetamin store, so
      // that the canvas inside the demo doesn't attempt to use a canvas filter.
      const canvasFilter = this.supportsCanvasFilter()

      if (!this.isMobile) {
        this.canvasFilter = canvasFilter
      }

      this.$vuetamin.store.mutate('updateCanvasFilterSupport', canvasFilter)
    },

    requestPermission() {
      this.$mote.gyroscope.requestPermission().then((isGranted) => {
        this.needsPermission = false
        this.gyroscope = CHECK_STATE.TRUE
      })
    }
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
  width: 100vw;
  max-width: 24rem;
  z-index: -1;
  background: $color-translucent-dark;

  &.appear-enter-active,
  &.appear-leave-active {
    transition: 0.5s;
    .browser-support__content {
      transition: 0.2s;
      transition-delay: 0.3s;
    }
  }
  &.appear-enter,
  &.appear-leave-to {
    transform: translateY(130%);
    @include media('md') {
      transform: translateX(-100%);
    }
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
  .icon {
    margin-top: rem(9px);
  }
}

.browser-support__content {
}

.check-list {
  li:not(:last-child) {
    margin-bottom: 0.75rem;
  }
}
</style>
