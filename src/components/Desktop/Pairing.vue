<template>
  <div class="overlay pairing relative flex">
    <div class="relative pairing__content">
      <h1 class="title">drawmote</h1>
      <p class="lead text-muted">{{ $t('desktop.lead') }}</p>
      <h2 class="code">
        <transition name="appear">
          <div v-if="code" class="code__content">
            <div class="code-circle" v-for="(number, index) in pairingCodeNumbers" :key="index"><span>{{ number }}</span></div>
          </div>
        </transition>
      </h2>
      <div class="actions">
        <button @click.prevent="skipPairing" type="button" class="button skip-button">{{ $t('desktop.skipButton') }}</button>
      </div>
      <browser-support checks="desktop" />
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
  color: black;
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

.pairing__content {
  padding: 5rem;
  z-index: $index-pairing;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 3.5rem;
  line-height: 1;
  letter-spacing: 2px;
}

.lead {
  font-size: 2rem;
  max-width: 50rem;
  margin: 0.5rem 0 2rem;
}

.code {
  font-size: 2.25rem;
  font-weight: 900;
  margin-top: 2rem;
  div {
    color: $color-greydark;
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

.skip-button {
  font-size: 1rem;
  font-weight: 700;
  margin-top: 2rem;
  color: $color-red;
  border-bottom: 1px solid;
}
</style>
