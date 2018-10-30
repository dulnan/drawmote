<template>
  <div class="logo mrgt+" ref="logo">
    <div class="logo__app">
      <img src="drawmote-logo.png" />
    </div>
    <background-animation :center="center" />
  </div>
</template>

<script>
import { threads } from '@/store'

import BackgroundAnimation from '@/components/Common/BackgroundAnimation.vue'

export default {
  name: 'Logo',

  components: {
    BackgroundAnimation
  },

  vuetamin: {
    setCenter: [threads.SIZES]
  },

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
      if (this.$refs.logo) {
        const rect = this.$refs.logo.getBoundingClientRect()

        this.center = {
          x: rect.left + (rect.width / 2),
          y: rect.top + (rect.height / 2)
        }
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
    font-size: 11rem;
  }
  @include media('md') {
    font-size: 12rem;
  }
  @include media('lg') {
    font-size: 16rem;
    margin-left: -1em;
  }
}

.logo__app {
  position: relative;
  z-index: 1;
  width: 1em;
  height: 1em;
  background: white;
  border-radius: 0.22em;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 ((30 / $logo-base) * 1em) ((100 / $logo-base) * 1em) ((7 / $logo-base) * 1em) rgba(0,0,0,0.04),
  0 ((1 / $logo-base) * 1em) ((4 / $logo-base) * 1em) ((2 / $logo-base) * 1em) rgba(0,0,0,0.01);
  /* animation: 2s pulse cubic-bezier(1, -0.04, 0.63, 1.01) infinite alternate; */

  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
