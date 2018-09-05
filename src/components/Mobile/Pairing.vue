<template>
  <div class="mobile-pairing absolute mobile-font-size">
    <div class="mobile-pairing__content relative">
      <h1 class="title">drawmote</h1>
      <p class="lead">Visit drawmote.app on a desktop device to get your pairing code and establish a connection.</p>
      <div class="code relative">
        <div class="code__circles flex">
          <div class="code-circle" v-for="(char, index) in inputChars" v-bind:class="{ 'contains': char !== ' ' }" :key="char + index"><span>{{ char }}</span></div>
        </div>

        <form class="code__form absolute" @submit.prevent="onSubmit">
          <input maxlength="6" v-model="inputValue" class="code__input absolute" type="tel" pattern="[0-9]*" novalidate ref="pairing_id">
        </form>

        <button
          v-show="inputValue.length > 0"
          @click="onSubmit"
          class="button button--primary code-submit-button button--responsive"
        >
          <span>Pair with desktop</span>
        </button>

        <transition name="appear">
          <div v-if="codeInvalid" class="code__error">The entered code is not valid :(</div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pairing',

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
      const isValid = await this.$connection.validateCode(code)

      if (isValid) {
        this.$connection.initPeering()
      } else {
        this.codeInvalid = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile-pairing {
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  color: $color-black;
}

.mobile-pairing__content {
  z-index: $index-pairing;
}

.title {
  font-size: 1em;
}

.lead {
  font-size: 0.45em;
}

.code {
  margin-top: .5em;
}

.code__circles {
  div {
    color: white;
    font-size: 1em;
    &.contains {
      background: $color-code;
    }
  }
}

.code__form {
  width: 100%;
  height: 1em;
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
  color: $color-red;
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

.code-submit-button {
  margin-top: 0.5em;
}
</style>
