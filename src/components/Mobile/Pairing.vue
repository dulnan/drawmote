<template>
  <div class="mobile-pairing">
    <div class="mobile-pairing__content relative pdgh">
      <h1 class="text-heavy mrgt">drawmote</h1>
      <p class="h2 text-bold mrgb text-muted">{{ $t('subtitle') }}</p>
      <p
        class="h4 text-muted text-light text-hyphens mrgb md-mrgb+ mrgt- md-mrgt"
      >
        {{ $t('mobile.lead') }}
      </p>
      <div class="code code--mobile relative">
        <ServerStatus v-if="hasServerError" />
        <div v-else class="code__circles flex">
          <div
            v-for="(char, index) in inputChars"
            :key="char + index"
            class="code__item"
          >
            <div
              class="code-circle"
              :class="[
                { contains: char !== ' ', invalid: char.search(/[0-9]/g) },
                'code-circle--' + char
              ]"
            >
              <span>{{ char }}</span>
            </div>
          </div>
        </div>

        <form
          v-if="!hasServerError"
          class="code__form absolute"
          @submit.prevent="onSubmit"
        >
          <input
            ref="pairing_id"
            v-model="inputValue"
            maxlength="6"
            class="code__input absolute"
            type="tel"
            pattern="[0-9]*"
            novalidate
          />
        </form>

        <button
          v-show="inputValue.length === 6"
          class="btn btn--primary btn--block mrgt+"
          @click.prevent="onSubmit"
        >
          <span>{{ $t('mobile.pairButton') }}</span>
        </button>

        <transition name="appear">
          <div v-if="codeInvalid" class="code__error">
            {{ $t('mobile.codeInvalid') }}
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import ServerStatus from '@/components/Common/ServerStatus.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Pairing',

  components: {
    ServerStatus
  },

  data() {
    return {
      inputValue: '',
      codeInvalid: false
    }
  },

  computed: {
    ...mapGetters(['hasServerError']),

    inputChars: function() {
      return String(this.inputValue + '      ')
        .slice(0, 6)
        .split('')
    }
  },

  watch: {
    inputValue: function() {
      this.codeInvalid = false
    }
  },

  methods: {
    onSubmit() {
      const code = this.$refs.pairing_id.value
      this.validateCode(code)
    },

    validateCode(code) {
      this.$peersox
        .joinPairing(code)
        .then(pairing => {
          this.$peersox
            .connect(pairing)
            .then(() => {
              this.codeInvalid = false
              this.$track('Pairing', 'valid', '1')
              this.$sentry.logInfo('pairing', 'code:valid')
              this.$peersox.storePairing(pairing)
              this.$store.commit('setServerStatus')
            })
            .catch(error => {
              this.$store.commit('setServerStatus', error)
              this.$sentry.logInfo('pairing', 'connect:failed')
            })
        })
        .catch(error => {
          this.$store.commit('setServerStatus', error)
          this.$sentry.logInfo('pairing', 'code:invalid')
          this.codeInvalid = true
          this.$track('Pairing', 'valid', '0')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/components/_code.scss';

.mobile-pairing {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // text-align: center;
  margin-bottom: $footer-height-xs;
  user-select: none;
  // min-height: calc(100vh - #{$footer-height-xs});
  overflow: hidden;
  padding-top: 80vw;
}

.mobile-pairing__content {
  z-index: $index-mobile-pairing;
  margin-bottom: auto;
  padding-bottom: 2rem;
}

.code--mobile {
  font-size: calc((100vw - 2rem) / 7);

  .code__circles {
    div {
      font-size: 1em;
    }
  }

  .code__form {
    height: 1em;
    right: -1rem;
  }

  .code__input {
    background: none;
    opacity: 0;
    font-size: 0.7em;
    line-height: 0;
    width: 100%;
    font-family: monospace;
    letter-spacing: 1.12em;
    padding-left: 0.1em;
    margin-right: -1em;
  }

  .code__error {
    margin-top: 1em;
    font-weight: 600;
    color: $brand-color;
    font-size: 0.875rem;
    letter-spacing: 0.5px;
    padding: 0.25rem 0;
    &.appear-enter-active,
    &.appear-leave-active {
      transition: 0.5s;
    }
    &.appear-enter,
    &.appear-leave-to {
      opacity: 0;
      transform: translateY(50%);
    }
  }
}
</style>
