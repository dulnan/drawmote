<template>
  <li class="text-right hidden-xs-down footer-copyright">
    <div class="pdg footer-text">
      Made by <a href="http://www.janhug.info" class="text-bold">Jan Hug</a> at
      <a href="https://www.liip.ch"><LiipLogo /></a>
    </div>
  </li>
</template>

<script>
import LiipLogo from '@/assets/icons/liip-logo.svg'

export default {
  name: 'FooterCopyright',

  components: {
    LiipLogo
  }
}
</script>

<style lang="scss">
.footer-copyright {
  svg {
    height: 0.7em;
    margin-left: 0.1rem;
    fill: currentColor;
  }
}
</style>
