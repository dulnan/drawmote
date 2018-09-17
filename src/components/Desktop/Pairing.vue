<template>
  <div class="overlay pairing-desktop absolute flex pdg++">
    <div class="pairing__container">
      <div class="md-mrgr++">
        <logo />
      </div>
      <div>
        <h1 class="text-heavy sm-mrgt md-mrgt+ lg-mrgt++">drawmote</h1>
        <p class="h2 text-bold mrgb+ text-muted">{{ $t('subtitle') }}</p>
        <p class="text-muted text-light mrgt0 h2 pairing-lead">{{ $t('desktop.lead') }}</p>
        <div class="code code--desktop mrgt++">
          <div class="code__content">
            <div v-for="(number, index) in pairingCodeNumbers" :key="index" class="code__item" :class="{ 'visible': hasCode }">
              <div class="code-circle contains" :class="'code-circle--' + number">
                <span>{{ number }}</span>
              </div>
            </div>
          </div>
        </div>
        <p class="code-timeout text-muted text-light" :class="{ 'visible': hasCode }">
          {{ $t('desktop.countdownPrefix') }}<span>{{ $tc('desktop.countdownSeconds', countdown, { count: countdown }) }}</span>{{ $t('desktop.countdownSuffix') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '@/components/Logo.vue'

const PAIRING_TIMEOUT = 60
let interval = null

export default {
  name: 'Pairing',

  components: {
    Logo
  },

  data () {
    return {
      showModal: false,
      countdown: PAIRING_TIMEOUT
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
      return this.hasCode ? this.code.split('') : new Array(6).fill(' ')
    },

    hasCode: function () {
      return this.code.length > 0
    }
  },

  watch: {
    code (code) {
      if (code) {
        this.startTimer()
      } else {
        this.stopTimer()
      }
    }
  },

  methods: {
    startTimer () {
      this.stopTimer()
      this.countdown = PAIRING_TIMEOUT

      interval = window.setInterval(() => {
        this.countdown--

        if (this.countdown <= 0) {
          this.$emit('pairingTimeout')
          this.stopTimer()
        }
      }, 1000)
    },

    stopTimer () {
      if (interval) {
        window.clearInterval(interval)
      }
    }
  },

  mounted () {
  }
}
</script>

<style lang="scss" scoped>
.pairing-desktop {
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

.code--desktop {
  display: flex;
  justify-content: center;
  @include media('md') {
    justify-content: flex-start;
  }
  .code__item {
    opacity: 0;
    transform: scale(1.3);
    transition: 0.55s cubic-bezier(0.79, -1.26, 0.21, 1.99);
    span {
      opacity: 0;
      transition: 0.4s cubic-bezier(0.64, 0.1, 0.61, 1.18);
      transform: scale(0.8);
    }
    .code-circle:before {
      transition: 0.5s cubic-bezier(0.57,-0.26, 0.24, 1.08);
      transform-origin: center;
      transform: scaleX(0);
    }
    @for $i from 1 through 6 {
      &:nth-child(#{$i}) {
        transition-delay: ($i / 8) * 1s;
        span {
          transition-delay: (($i / 8) * 1s) + 0.32s;
        }
        .code-circle:before {
          transition-delay: (($i / 8) * 1s) + 0.1s;
        }
      }
    }
    &.visible {
      &, span, .code-circle:before {
        opacity: 1;
        transform: none;
      }
    }
  }
}

.pairing-lead {
  max-width: 34rem;
  @include media('lg') {
    max-width: 40rem;
  }
}

.code-timeout {
  opacity: 0;
  transition: 0.3s;
  transition-delay: 0.3s;
  &.visible {
    opacity: 1;
  }
}
</style>
