<template>
  <div class="mobile-pairing overlay flex">
    <div class="mobile-pairing__content relative">
      <h1>drawmote</h1>
      <p class="lead">Visit drawmote.io on a desktop device to get your pairing code and establish a connection.</p>
      <div class="code relative">
        <div class="code__circles flex">
          <div v-for="char in inputChars" v-bind:class="{ 'contains': char !== ' ' }">{{ char }}</div>
        </div>

        <form class="code__form absolute overlay" v-on:submit.prevent="onSubmit">
          <input maxlength="5" v-model="inputValue" class="code__input absolute overlay" type="text" ref="pairing_id"></input>
        </form>

        <transition name="appear">
          <div v-if="codeInvalid" class="code__error absolute">The entered code is not valid :(</div>
        </transition>
      </div>
    </div>
    <background-animation></background-animation>
  </div>
</template>

<script>
import BackgroundAnimation from '@/components/BackgroundAnimation.vue'

export default {
  name: 'Pairing',
  components: {
    BackgroundAnimation
  },

  sockets: {
    connectionFailed: function () {
      this.codeInvalid = true
    }
  },

  data () {
    return {
      isConnected: false,
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
      return String(this.inputValue + '     ').slice(0, 5).split('')
    }
  },

  methods: {
    onSubmit () {
      const pairingId = this.$refs.pairing_id.value
      this.$socket.emit('sessionConnect', {
        session: pairingId
      })
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
  margin-top: 3rem;
}

h1 {
  font-size: 4rem;
}

.lead {
  font-size: 1.25rem;
  font-weight: 100;
}

.code {
  margin-top: 1.5rem;
}

.code__circles {
  align-items: center;
  justify-content: center;
  div {
    width: 3rem;
    height: 3rem;
    border-radius: 100%;
    margin: 0 0.25rem;
    color: white;
    font-weight: 900;
    font-size: 1.75rem;
    line-height: 2.75rem;
    text-transform: uppercase;
    border: 2px solid $color-black;
    &.contains {
      background: $color-black;
    }
  }
}

.code__form {

}

.code__input {
  background: none;
  opacity: 0;
}


.code__error {
  top: 100%;
  text-align: center;
  right: 0;
  background: $color-red;
  border-radius: 10rem;
  width: 17rem;
  margin: 1.5rem auto 0;
  text-transform: uppercase;
  font-weight: 900;
  color: white;
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
