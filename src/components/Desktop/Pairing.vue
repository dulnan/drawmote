<template>
  <div class="overlay pairing relative flex">
    <div class="relative pairing__content">
      <h1 class="title">drawmote</h1>
      <p class="lead">Use your phone to draw on this screen. Visit drawmote.io on your mobile device and enter the following code to connect to this session.</p>
      <h2 class="code">
        <transition name="appear">
          <div v-if="code" class="code__content">
            <span v-for="(number, index) in pairingCodeNumbers" :key="index">{{ number }}</span>
          </div>
        </transition>
      </h2>
      <div>
        <button @click.prevent="skipPairing" type="button" class="button skip-button">Skip this step</button>
      </div>
    </div>
    <!--<background-animation></background-animation>-->
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
  font-weight: 900;
  color: $color-red;
  letter-spacing: 2px;
}

.lead {
  font-size: 2rem;
  line-height: 3rem;
  font-weight: 300;
  max-width: 50rem;
  margin: 0.5rem 0 2rem;
  color: #555;
}

.code {
  font-size: 3rem;
  font-weight: 900;
  min-height: 4rem;
  margin-bottom: auto;
  margin-top: 2rem;
  span {
    width: 6rem;
    height: 6rem;
    line-height: 6.2rem;
    display: inline-block;
    border-radius: 10rem;
    color: white;
    color: white;
    text-align: center;
    background: #111;
    margin-right: 1.25rem;
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

.skip-button {
  text-transform: uppercase;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 2rem;
  border: 1px solid;
  padding: 0.4em 0.5em;
  border-radius: 10rem;
}
</style>
