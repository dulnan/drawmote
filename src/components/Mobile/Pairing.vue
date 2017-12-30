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

  data () {
    return {
      isConnected: false,
      inputValue: ''
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
  align-items: center;
  padding: 2rem;
}

.mobile-pairing__content {
  z-index: $index-pairing;
}

h1 {
  font-size: 4rem;
}

.lead {
  font-size: 1.25rem;
  font-weight: 100;
}

.code {
  margin-top: 2rem;
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
</style>
