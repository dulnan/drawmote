<template>
  <transition name="appear">
    <div class="connection" v-if="connectionRestorable">
      <div class="connection__content">
        <div>
          <h3>Restore Connection</h3>
          <p>You can use a previously made connection. Press "restore" on both devices.</p>
        </div>
        <div class="connection__actions">
          <button
            class="button button--secondary connection__button-clear"
            @click="deleteConnection"
          >
            <span>Delete</span>
          </button>
          <button
            class="button button--primary connection__button connection__button--restore"
            :class="{'restoring': isRestoring, 'is-restored': isRestored }"
            @click="restoreConnection"
          >
            <span>Restore Connection</span>
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
import { EventBus } from '@/events'

import IconRestore from '@/assets/icons/icon-restore.svg'

export default {
  name: 'Connection',

  components: {
    IconRestore
  },

  data () {
    return {
      connectionRestorable: false,
      peering: {},
      isRestoring: false,
      isRestored: false
    }
  },

  methods: {
    restoreConnection () {
      if (this.isRestoring) {
        return
      }
      this.isRestoring = true
      this.$connection.initPeering(this.peering.code, this.peering.hash)
    },

    deleteConnection () {
      this.$connection.deleteSession()
      this.connectionRestorable = false
    }
  },

  mounted () {
    EventBus.$on('isConnected', (isConnected) => {
      this.isRestored = true
      this.connectionRestorable = false
    })

    EventBus.$on('connectionRestorable', (peering) => {
      this.isRestoring = false
      this.isRestored = false
      this.connectionRestorable = true
      this.peering = peering
    })
  }
}
</script>

<style lang="scss">
.connection {
  position: absolute;
  z-index: $index-modal;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  border-top: 1px solid $color-border;

  padding: 2rem;
  opacity: 1;

  &.appear-enter-active, &.appear-leave-active {
    transition: .5s;
  }
  &.appear-enter, &.appear-leave-to {
    transform: translateY(100%);
  }
}

.connection__content {
  @include desktop() {
    display: flex;
  }
}

.connection__actions {
  margin-left: auto;
  display: flex;
  align-items: center;
}

@keyframes iconrotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(1turn);
  }
}

.button.connection__button--restore {
  transition: 0.3s;
  position: relative;
  margin-left: auto;
  margin-left: 1rem;
  span {
    transition: 0.3s;
  }
  &.restoring {
    background: $color-greylight;
    border-color: $color-greylight;
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
    fill: $color-greydark;
    display: block;
    width: 2rem;
    height: 2rem;
    animation: 2s iconrotate infinite linear;
  }
}
</style>
