<template>
  <div class="overlay pairing relative flex">
    <div class="relative pairing__content">
      <h1 class="title">drawmote</h1>
      <p class="lead">Use your phone to draw on this screen. Visit drawmote.io on your mobile device and enter the following code to connect to this session.</p>
      <h2 class="code">
        <transition name="appear">
          <div v-if="code" class="code__content">
            <span v-for="number in pairingCodeNumbers">{{ number }}</span>
          </div>
        </transition>
      </h2>
    </div>
    <background-animation></background-animation>
    <div class="absolute footer">
      Made by <a href="http://www.janhug.info">Jan Hug</a>, with help from Pascal Thormeier and others.
    </div>
  </div>
</template>

<script>
import BackgroundAnimation from '@/components/BackgroundAnimation.vue'

export default {
  name: 'Pairing',
  components: {
    BackgroundAnimation
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
  color: $color-black;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  &.appear-enter-active, &.appear-leave-active {
    transition: .5s;
    .title {
      transition: .5s;
    }
  }
  &.appear-enter, &.appear-leave-to {
    transform: scale(1.05);
    opacity: 0;
    .title {
      transform: translateY(50%);
    }
  }
}

.pairing__content {
  padding: 2rem;
  z-index: $index-pairing;
}

.title {
  font-size: 7rem;
}

.lead {
  font-size: 1.75rem;
  font-weight: 100;
  max-width: 660px;
  margin: 0.5rem 0 2.5rem;
}

.code {
  font-size: 1.75rem;
  font-weight: 400;
  min-height: 3rem;
  span {
    width: 3rem;
    height: 3rem;
    line-height: 3rem;
    margin: 0 0.5rem;
    display: inline-block;
    border-radius: 10rem;
    background: $color-black;
    color: white;
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

.footer {
  z-index: $index-pairing;
  top: auto;
  text-align: center;
  right: 0;
  bottom: 0;
  padding: 1rem;
  opacity: 0.5;
  font-size: 0.9rem;
}
</style>
