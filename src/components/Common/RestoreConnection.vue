<template>
  <transition name="appear">
    <div v-show="isVisible" class="connection pdg lg-pdg+">
      <div class="flex-1 flex">
        <div class="connection__icon hidden-md-down mrgr lg-mrgr+">
          <IconRestore />
        </div>
        <div>
          <h3 class="text-bold">{{ $t('connection.title') }}</h3>
          <p class="mrg0 h4 text-light text-hyphens mrgb sm-mrgb0 sm-pdgr-">
            {{ $t('connection.text') }}
          </p>
        </div>
      </div>
      <div class="connection__buttons flex md-mrgl">
        <div>
          <button
            class="btn btn--default connection__button-clear"
            @click="deleteConnection"
          >
            <span>{{ $t('connection.delete') }}</span>
          </button>
        </div>
        <div class="flex-1 pdgl">
          <button
            class="btn btn--primary connection__button connection__button--restore relative btn--block"
            :class="{ restoring: isRestoring, 'is-restored': isRestored }"
            @click="restoreConnection"
          >
            <span>{{ $t('connection.reconnect') }}</span>
            <div class="connection__button-animation">
              <IconRestore />
            </div>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import IconRestore from '@/assets/icons/icon-restore.svg'
import { mapGetters } from 'vuex'

/**
 * Provides a way to restore a previously made connection.
 */
export default {
  name: 'RestoreConnection',

  components: {
    IconRestore
  },

  data() {
    return {
      connectionRestorable: false,
      pairing: {},
      isRestoring: false,
      isRestored: false,
      connectionTimeout: false,
      windowTimeout: null
    }
  },

  computed: {
    ...mapGetters(['isDrawing']),

    isVisible() {
      return this.connectionRestorable && !this.isDrawing
    }
  },

  mounted() {
    this.$peersox.on('connected', this.handleConnected)

    this.$peersox
      .restorePairing()
      .then((pairing) => {
        if (pairing) {
          this.pairing = pairing
          this.isRestoring = false
          this.isRestored = false
          this.connectionRestorable = true
          this.$sentry.logInfo('pairing', 'restoring:found')
        }
      })
      .catch(() => {
        this.$sentry.logInfo('pairing', 'restoring:failed')
      })
  },

  beforeDestroy() {
    this.$peersox.off('connected', this.handleConnected)
  },

  methods: {
    /**
     * Initialize a peering connection given the stored code and hash.
     */
    restoreConnection() {
      if (this.isRestoring) {
        return
      }

      this.$sentry.logInfo('pairing', 'restoring:start')

      this.isRestoring = true

      this.$peersox
        .close()
        .then(this.$peersox.connect(this.pairing))
        .catch(() => {
          this.$sentry.logInfo('pairing', 'restoring:failed')
        })

      window.clearTimeout(this.windowTimeout)

      this.windowTimeout = window.setTimeout(() => {
        this.connectionTimeout = true
        this.isRestoring = false
      }, 20000)
    },

    /**
     * Delete the stored connection from the history.
     */
    deleteConnection() {
      this.connectionRestorable = false
      this.$peersox.deletePairing()
    },

    handleConnected() {
      this.isRestored = true
      this.connectionRestorable = false
      this.connectionTimeout = false
    }
  }
}
</script>

<style lang="scss">
.connection {
  position: relative;
  position: sticky;
  bottom: $footer-height-xs;
  z-index: $index-footer - 1;
  background: $color-translucent-dark;
  margin-top: 4rem;

  opacity: 1;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  text-align: left;

  @include media('sm') {
    position: absolute;
    left: 1rem;
    right: 1rem;
    flex-direction: row;
    border-radius: $border-radius-default;
    bottom: calc(#{$footer-height-xs} + 0.5rem);
  }

  &.appear-enter-active,
  &.appear-leave-active {
    transition: 0.5s;
  }
  &.appear-enter,
  &.appear-leave-to {
    transform: translateY(100%);
    opacity: 0;
  }
}

.connection__icon {
  background: $brand-color;
  border-radius: $border-radius-default;
  font-size: 3.75rem;
  flex: 0 0 1em;
  width: 1em;
  height: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    height: 0.7em;
    width: 0.7em;
    fill: white;
    display: block;
  }
}

@keyframes iconrotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(1turn);
  }
}

.connection__buttons {
  align-items: center;
}

.btn.connection__button--restore {
  position: relative;
  span {
    transition: 0.3s;
  }
  &:before {
    content: '';
    display: block;
    background: rgba($brand-color-darker, 0.7);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transform-origin: left;
    transform: scaleX(0);
  }
  &.restoring {
    &:before {
      transform: none;
      transition: 20s linear;
    }
    span {
      opacity: 0;
    }
  }
}

.connection__button-animation {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  height: 2rem;
  width: 2rem;
  transform: translate(-50%, -50%);
  transition: 0.3s;
  opacity: 0;

  .restoring & {
    opacity: 1;
  }
  svg {
    fill: white;
    display: block;
    width: 2rem;
    height: 2rem;
    animation: 2s iconrotate infinite linear;
  }
}
</style>
