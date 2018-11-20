<template>
  <transition name="fade">
    <div class="connection-timeout" v-show="isVisible">
      <div>
        <h3 class="h2 text-bold">
          {{ $t('connectionTimeout.title') }}
        </h3>
        <p class="h2 mrgb+">
          {{ $t('connectionTimeout.text ') }}
        </p>
        <ul class="list-inline">
          <li>
            <button
              class="btn btn--primary relative"
              @click="backToPairing"
            >
              {{ $t('connectionTimeout.toPairing') }}
            </button>
          </li>
          <li v-if="!isMobile">
            <button
              class="btn btn--default relative"
              @click="continueDrawing"
            >
              {{ $t('connectionTimeout.continueDrawing') }}
            </button>
          </li>
        </ul>
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
  name: 'ConnectionTimeout',

  components: {
    IconRestore
  },

  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      isVisible: false
    }
  },

  methods: {
    handleConnected () {
      this.isVisible = false
    },

    handleConnectionTimeout () {
      this.isVisible = true
    },

    continueDrawing () {
      this.isVisible = false
    },

    backToPairing () {
      this.$mote.disconnect()
    }
  },

  mounted () {
    this.$mote.on('connected', this.handleConnected)
    this.$mote.on('connectionTimeout', this.handleConnectionTimeout)
  },

  beforeDestroy () {
    this.$mote.off('connected', this.handleConnected)
    this.$mote.off('connectionTimeout', this.handleConnectionTimeout)
  }
}
</script>

<style lang="scss">
.connection-timeout {
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 1rem;
  background: rgba($alt-color-lighter, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  &.fade-enter-active, &.fade-leave-active {
    &, > div {
      transition: .5s;
    }
  }
  &.fade-enter, &.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    > div {
      transform: scale(1.1);
    }
  }

  @include media('sm') {
    text-align: left;
  }
  > div {
    max-width: 60rem;
  }
}
</style>
