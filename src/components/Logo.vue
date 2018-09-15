<template>
  <div class="logo mrgt+" ref="logo">
    <div class="logo__app">
      <logo-stroke />
    </div>
    <background-animation :center="center" />
  </div>
</template>

<script>
import { THREAD_SIZES } from '@/settings/drawthreads'

import LogoStroke from '@/assets/images/logo.svg'
import BackgroundAnimation from '@/components/BackgroundAnimation.vue'

export default {
  name: 'Logo',

  components: {
    LogoStroke,
    BackgroundAnimation
  },

  draw: [
    {
      threads: [THREAD_SIZES],
      handler: function (state) {
        this.setCenter()
      }
    }
  ],

  data () {
    return {
      center: {
        x: 0,
        y: 0
      }
    }
  },

  computed: {
  },

  methods: {
    setCenter () {
      const rect = this.$refs.logo.getBoundingClientRect()

      this.center = {
        x: rect.left + (rect.width / 2),
        y: rect.top + (rect.height / 2)
      }
    }
  },

  mounted () {
    this.setCenter()

    window.setTimeout(() => {
      this.setCenter()
    }, 500)
  }
}
</script>

<style lang="scss">
$logo-base: 768;

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0.95);
  }
}

.logo {
  font-size: 9rem;

  @include media('sm') {
    font-size: 14rem;
  }
  @include media('md') {
    font-size: 10rem;
  }
  @include media('lg') {
    margin-left: -1em;
    font-size: 12rem;
  }
}

.logo__app {
  position: relative;
  z-index: 1;
  width: 1em;
  height: 1em;
  background: white;
  border-radius: 0.23em;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: radial-gradient(46% -46%, #FFFFFF 52%, #EAEAEA 100%);
  background-image: linear-gradient(21deg, #FFFFFF 14%, rgba(255,255,255,0.00) 89%);
  box-shadow: 0 ((20 / $logo-base) * 1em) ((100 / $logo-base) * 1em) ((1 / $logo-base) * 1em) rgba(0,0,0,0.07),
  0 ((1 / $logo-base) * 1em) ((4 / $logo-base) * 1em) ((2 / $logo-base) * 1em) rgba(0,0,0,0.01);
  // animation: 0.7s pulse cubic-bezier(1, -0.04, 0.63, 1.01) infinite alternate;

  svg {
    height: auto;
    width: 60%;
    display: block;
    margin-right: ((-11 / $logo-base) * 1em);
  }
}
</style>
