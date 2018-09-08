<template>
  <div class="overlay pairing relative flex pdg++">
    <div class="grid">
      <div class="grid__item w-3/5">
        <h1 class="text-heavy text-brand">drawmote</h1>
        <p class="text-muted text-light mrgt0 h2">{{ $t('desktop.lead') }}</p>
        <h2 class="code mrgt+">
          <transition name="appear">
            <div v-if="code" class="code__content">
              <div class="code-circle" v-for="(number, index) in pairingCodeNumbers" :key="index"><span>{{ number }}</span></div>
            </div>
          </transition>
        </h2>
        <div class="actions mrgt">
          <button @click.prevent="skipPairing" type="button" class="btn btn--default btn--small">{{ $t('desktop.skipButton') }}</button>
        </div>
        <browser-support checks="desktop" />
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from '@/events'

import BrowserSupport from '@/components/BrowserSupport.vue'

export default {
  name: 'Pairing',

  components: {
    BrowserSupport
  },

  data () {
    return {
      showModal: false
    }
  },

  props: {
    code: {
      type: String,
      default: ''
    }
  },

  methods: {
    skipPairing () {
      EventBus.$emit('isConnected')
    }
  },

  computed: {
    pairingCodeNumbers: function () {
      return this.code.split('')
    }
  }
}
</script>

<style lang="scss" scoped>
.pairing {
  transform-style: preserve-3d;
  perspective: 700px;
  &.appear-enter-active, &.appear-leave-active {
    transition: .5s;
    .pairing__content {
      transition: .5s;
    }
  }
  &.appear-enter, &.appear-leave-to {
    opacity: 0;
    .pairing__content {
      transform: translateZ(5rem);
    }
  }
}

.code {
  div {
    color: $alt-color;
  }
}

.code__content {
  &.appear-enter-active, &.appear-leave-active {
    transition: .5s;
    span {
      transition: .5s;
    }
  }
  &.appear-enter, &.appear-leave-to {
    opacity: 0;
    span {
      transform: rotate(45deg) scale(0.7);
    }
  }
}

.actions {
  margin-bottom: auto;
}
</style>
