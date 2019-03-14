<template>
  <div class="mobile-pairing">
    <div class="mobile-pairing__content relative pdgh">
      <h1 class="text-heavy mrgt">drawmote</h1>
      <p class="h2 text-muted text-light text-hyphens mrgb+ mrgt">{{ $t('mobile.lead') }}</p>
      <div class="code code--mobile relative">
        <div class="code__circles flex">
          <div class="code__item" v-for="(char, index) in inputChars" :key="char + index">
            <div
              class="code-circle"
              :class="[{ 'contains': char !== ' ', 'invalid': char.search(/[0-9]/g) }, 'code-circle--' + char]"
            >
              <span>{{ char }}</span>
            </div>
          </div>
        </div>

        <form class="code__form absolute" @submit.prevent="onSubmit">
          <input maxlength="6" v-model="inputValue" class="code__input absolute" type="tel" pattern="[0-9]*" novalidate ref="pairing_id">
        </form>

        <button
          v-show="inputValue.length === 6"
          @click.prevent="onSubmit"
          class="btn btn--primary btn--block mrgt+"
        >
          <span>{{ $t('mobile.pairButton') }}</span>
        </button>

        <transition name="appear">
          <div v-if="codeInvalid" class="code__error">{{ $t('mobile.codeInvalid') }}</div>
        </transition>

      </div>
    </div>
  </div>
</template>

<script>
import Logo from '@/components/Common/Logo.vue'

export default {
  name: 'Pairing',

  components: {
    Logo
  },

  data () {
    return {
      inputValue: '',
      codeInvalid: false
    }
  },

  watch: {
    inputValue: function () {
      this.codeInvalid = false
    }
  },

  computed: {
    inputChars: function () {
      return String(this.inputValue + '      ').slice(0, 6).split('')
    }
  },

  methods: {
    onSubmit () {
      const code = this.$refs.pairing_id.value
      this.validateCode(code)
    },

    validateCode (code) {
      this.$peersox.joinPairing(code).then(pairing => {
        this.$peersox.connect(pairing).then(() => {
          this.codeInvalid = false
          this.$track('Pairing', 'valid', '1')
          this.$peersox.storePairing(pairing)
        }).catch((error) => {
          console.log('Error connecting to the WebSocket server: ', error)
        })
      }).catch((error) => {
        console.log(error)
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
  text-align: center;
  margin-bottom: $footer-height-xs;
  user-select: none;
  // min-height: calc(100vh - #{$footer-height-xs});
  overflow: hidden;
  padding-top: 84vw;
}

.mobile-pairing__content {
  z-index: $index-mobile-pairing;
  margin-bottom: auto;
  padding-bottom: 2rem;
  &.appear-enter-active, &.appear-leave-active {
    transition: 2.0s;
  }
  &.appear-enter-active {
    transition-delay: 4.3s;
  }
  &.appear-enter, &.appear-leave-to {
    transform: translateY(-30vw);
    opacity: 0;
  }
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
    &.appear-enter-active, &.appear-leave-active {
      transition: .5s;
    }
    &.appear-enter, &.appear-leave-to {
      opacity: 0;
      transform: translateY(50%);
    }
  }
}
</style>
