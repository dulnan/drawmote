<template>
  <div class="logo" ref="logo">
    <div class="logo__app">
      <logo-stroke />
    </div>
    <background-animation :center="center" />
  </div>
</template>

<script>
import debouncedResize from 'debounced-resize'

import LogoStroke from '@/assets/images/logo.svg'
import BackgroundAnimation from '@/components/BackgroundAnimation.vue'

export default {
  name: 'Logo',

  components: {
    LogoStroke,
    BackgroundAnimation
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
      const rect = this.$refs.logo.getBoundingClientRect()

      this.center = {
        x: rect.left + (rect.width / 2),
        y: rect.top + (rect.height / 2)
      }
    }
  },

  mounted () {
    this.setCenter()

    if (process.env.NODE_ENV === 'development') {
      window.setTimeout(() => {
        this.setCenter()
      }, 500)
    }
    debouncedResize((e) => {
      this.setCenter()
    })
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
    transform: scale(0.9);
  }
}

.logo {
}

.logo__app {
  position: relative;
  width: 1em;
  height: 1em;
  background: white;
  border-radius: 0.23em;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: radial-gradient(46% -46%, #FFFFFF 52%, #EAEAEA 100%);
  background-image: linear-gradient(21deg, #FFFFFF 14%, rgba(255,255,255,0.00) 89%);
  // box-shadow: 0 ((14 / $logo-base) * 1em) ((120 / $logo-base) * 1em) rgba(0,0,0,0.09);
  box-shadow: 0 ((20 / $logo-base) * 1em) ((100 / $logo-base) * 1em) ((1 / $logo-base) * 1em) rgba(0,0,0,0.07),
  0 ((1 / $logo-base) * 1em) ((4 / $logo-base) * 1em) ((2 / $logo-base) * 1em) rgba(0,0,0,0.01);

  // animation: 1s pulse cubic-bezier(1, -0.04, 0.63, 1.01) infinite alternate;
  font-size: 10rem;

  @include media('sm') {
    font-size: 13rem;
  }

  @include media('md') {
    font-size: 15rem;
  }

  @include media('lg') {
    font-size: 12rem;
  }

  svg {
    height: auto;
    width: 60%;
    display: block;
    margin-right: ((-11 / $logo-base) * 1em);
  }

  // &:before {
  //   content: "";
  //   width: 100vw;
  //   height: 100vh;
  //   position: fixed;
  //   top: 0;
  //   left: 0;
  //   opacity: 0.8;
  //   background: radial-gradient(
  //     circle at 50% 35%,
  //     #F2F1EF   0%,

  //     white    10%,

  //     #EAE8E5  20%,
  //     #EDECE9  20%,

  //     #E6E3DF  30%,
  //     #EAE8E5  30%,

  //     #E3DFDA  40%,
  //     #E6E3DF  40%,

  //     #DFDBD5  50%,
  //     #E3DFDA  50%,

  //     #DCD7D0  60%,
  //     #DFDBD5  60%,

  //     #D8D2CA  70%,
  //     #DCD7D0  70%,

  //     #D8D2CA  80%
  //     );
  //   z-index: -1;
  // }
}
</style>
