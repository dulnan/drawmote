<template>
  <div class="mobile-pairing">
    <logo />
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
    <connection />
  </div>
</template>

<script>
import Logo from '@/components/Common/Logo.vue'
import Connection from '@/components/Common/Connection.vue'

export default {
  name: 'Pairing',

  components: {
    Logo,
    Connection
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

    async validateCode (code) {
      const pairing = await this.$connection.getPeeringHash(code)

      if (pairing.code && pairing.hash) {
        this.$connection.initPeering(pairing.code, pairing.hash)
        this.$track('Pairing', 'valid', '1')
      } else {
        this.codeInvalid = true
        this.$track('Pairing', 'valid', '0')
      }
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
  color: $color-black;
  margin-bottom: $footer-height-xs;
  min-height: calc(100vh - #{$footer-height-xs});
}

.mobile-pairing__content {
  z-index: $index-mobile-pairing;
  margin-bottom: auto;
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
    font-weight: 500;
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
