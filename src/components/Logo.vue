<template>
  <div class="logo">
    <logo-stroke />
  </div>
</template>

<script>
import LogoStroke from '@/assets/images/logo.svg'

export default {
  name: 'Logo',

  components: {
    LogoStroke
  },

  data () {
    return {
    }
  },

  computed: {
  },

  methods: {
  },

  mounted () {
  }
}
</script>

<style lang="scss">
$logo-base: 768;

.logo {
  position: relative;
  font-size: 15rem;
  width: 1em;
  height: 1em;
  background: white;
  border-radius: 0.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: radial-gradient(46% -46%, #FFFFFF 52%, #EAEAEA 100%);
  background-image: linear-gradient(21deg, #FFFFFF 14%, rgba(255,255,255,0.00) 89%);
  box-shadow: 0 ((14 / $logo-base) * 1em) ((90 / $logo-base) * 1em) rgba(0,0,0,0.06);

  svg {
    height: auto;
    width: 70%;
    display: block;
  }

  &:before {
    content: "";
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    opacity: 0.8;
    background: radial-gradient(
      circle at 50% 35%,
      #F2F1EF   0%,

      white    10%,

      #EAE8E5  20%,
      #EDECE9  20%,

      #E6E3DF  30%,
      #EAE8E5  30%,

      #E3DFDA  40%,
      #E6E3DF  40%,

      #DFDBD5  50%,
      #E3DFDA  50%,

      #DCD7D0  60%,
      #DFDBD5  60%,

      #D8D2CA  70%,
      #DCD7D0  70%,

      #D8D2CA  80%
      );
    z-index: -1;
  }
}
</style>
