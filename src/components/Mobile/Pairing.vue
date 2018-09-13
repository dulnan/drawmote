<template>
  <div class="mobile-pairing pdg+">
    <logo />
    <div class="mobile-pairing__content relative">
      <h1 class="text-heavy mrgt">drawmote</h1>
      <p class="h2 text-muted text-light text-hyphens mrgb+ mrgt">{{ $t('mobile.lead') }}</p>
      <div class="code relative">
        <div class="code__circles flex">
          <div
            class="code-circle"
            v-for="(char, index) in inputChars"
            :class="[{ 'contains': char !== ' ', 'invalid': char.search(/[0-9]/g) }, 'code-circle--' + char]"
            :key="char + index"
          >
            <span>{{ char }}</span>
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
    <browser-support checks="mobile" />
  </div>
</template>

<script>
import BrowserSupport from '@/components/BrowserSupport.vue'
import Logo from '@/components/Logo.vue'

export default {
  name: 'Pairing',

  components: {
    BrowserSupport,
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
      const code = parseInt(this.$refs.pairing_id.value)
      this.validateCode(code)
    },

    async validateCode (code) {
      const peering = await this.$connection.getPeeringHash(code)

      if (peering.isValid) {
        this.$connection.initPeering(peering.code, peering.hash)
      } else {
        this.codeInvalid = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile-pairing {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: $color-black;
  height: 100%;
}

.mobile-pairing__content {
  z-index: $index-mobile-pairing;
  margin-bottom: auto;
}

.code {
  font-size: calc((100vw - 3rem) / 7);
}

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
  padding-left: 0.65em;
  margin-right: -1em;
}

.code__error {
  margin-top: 1em;
  font-weight: 700;
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
</style>
