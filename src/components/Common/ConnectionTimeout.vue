<template>
  <transition name="appear">
    <div class="connection-timeout" v-show="isVisible">
      <div>
        <h3 class="h2 text-bold">Connection Timeout</h3>
        <p class="h2 mrgb+">Looks like the connection between your phone and computer has timed out.</p>
        <button class="btn btn--primary relative" @click="isVisible = false">Continue drawing</button>
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
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba($alt-color-lighter, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  > div {
    max-width: 60rem;
  }
}
</style>
