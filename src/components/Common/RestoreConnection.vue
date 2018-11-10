<template>
  <transition name="appear">
    <div class="connection pdg lg-pdg+" v-show="isVisible">
      <div class="flex-1 flex">
        <div class="connection__icon hidden-md-down mrgr lg-mrgr+">
          <icon-restore />
        </div>
        <div>
          <h3 class="text-bold">{{ $t('connection.title') }}</h3>
          <p class="mrg0 h4 text-light text-hyphens mrgb sm-mrgb0 sm-pdgr-">{{ $t('connection.text') }}</p>
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
            :class="{'restoring': isRestoring, 'is-restored': isRestored }"
            @click="restoreConnection"
          >
            <span>{{ $t('connection.reconnect') }}</span>
            <div class="connection__button-animation">
              <icon-restore />
            </div>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import IconRestore from '@/assets/icons/icon-restore.svg'

/**
 * Provides a way to restore a previously made connection.
 */
export default {
  name: 'RestoreConnection',

  components: {
    IconRestore
  },

  data () {
    return {
      connectionRestorable: false,
      pairing: {},
      isRestoring: false,
      isRestored: false,
      isConnected: false,
      connectionTimeout: false,
      windowTimeout: null
    }
  },

  computed: {
    isVisible () {
      return this.connectionRestorable && !this.isConnected
    }
  },

  methods: {
    /**
     * Initialize a peering connection given the stored code and hash.
     */
    restoreConnection () {
      if (this.isRestoring) {
        return
      }

      this.isRestoring = true
      this.$mote.connect(this.pairing)

      window.clearTimeout(this.windowTimeout)

      this.windowTimeout = window.setTimeout(() => {
        this.connectionTimeout = true
        this.isRestoring = false
      }, 20000)
    },

    /**
     * Delete the stored connection from the history.
     */
    deleteConnection () {
      this.connectionRestorable = false
      this.$mote.deleteStoredPairing(this.pairing)
    },

    handleConnected () {
      this.isConnected = true
      this.isRestored = true
      this.connectionRestorable = false
      this.connectionTimeout = false
    },

    handleRestorable (pairing) {
      this.pairing = pairing
      this.isRestoring = false
      this.isRestored = false
      this.connectionRestorable = true
    }
  },

  mounted () {
    this.$mote.on('connected', this.handleConnected)
    this.$mote.on('restorable', (pairing) => {
      this.handleRestorable(pairing)
    })

    this.$mote.loadStoredPairings()
  },

  beforeDestroy () {
    this.$mote.off('connected', this.handleConnected)
    this.$mote.off('restorable', this.handleRestorable)
  }
}
</script>

<style lang="scss">
.connection {
  position: relative;
  position: sticky;
  bottom: $footer-height-xs;
  z-index: $index-footer - 1;
  background: white;
  border-top: 1px solid $alt-color-light;
  margin-top: 4rem;

  opacity: 1;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  text-align: left;

  @include media('sm') {
    position: absolute;
    left: 0;
    bottom: rem(54px);
    width: 100%;
    flex-direction: row;
  }
  @include media('lg') {
    bottom: rem(69px);
  }

  &.appear-enter-active, &.appear-leave-active {
    transition: .5s;
  }
  &.appear-enter, &.appear-leave-to {
    transform: translateY(100%);
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
    content: "";
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
