<template>
  <div class="overlay pairing absolute flex pdg++">
    <div class="pairing__container">
      <div class="md-mrgr++">
        <logo />
      </div>
      <div>
        <h1 class="text-heavy sm-mrgt md-mrgt+ lg-mrgt++">drawmote</h1>
        <p class="h2 text-bold mrgb+ text-muted">Draw remotely with your phone</p>
        <p class="text-muted text-light mrgt0 h2 pairing-lead">{{ $t('desktop.lead') }}</p>
        <div class="code mrgv++">
          <transition name="appear">
            <div v-if="code" class="code__content">
              <div
                class="code-circle contains"
                :class="'code-circle--' + number"
                v-for="(number, index) in pairingCodeNumbers"
                :key="index"
              >
                <span>{{ number }}</span>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '@/components/Logo.vue'

export default {
  name: 'Pairing',

  components: {
    Logo
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.pairing__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  @include media('md') {
    flex-direction: row;
    align-items: flex-start;
    text-align: left;
  }
}

.code {
  display: flex;
  justify-content: center;
  @include media('md') {
    justify-content: flex-start;
  }
}

.code__content {
  &.appear-enter-active, &.appear-leave-active {
    transition: .5s;
    .code-circle {
      transition: .5s;
    }
  }
  &.appear-enter, &.appear-leave-to {
    opacity: 0;
    .code-circle {
      transform: rotate(45deg) scale(0.1);
    }
  }
}

.pairing-lead {
  max-width: 34rem;
  @include media('lg') {
    max-width: 40rem;
  }
}
</style>
