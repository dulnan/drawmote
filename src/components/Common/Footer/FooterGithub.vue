<template>
  <li class="text-bold mrgla hover">
    <a class="pdg lg-pdg+ block" href="https://github.com/dulnan/drawmote-client">
      <icon-github class="icon icon--large" />
      <span class="hidden-sm-down">GitHub</span>
    </a>
  </li>
</template>

<script>
import IconGithub from '@/assets/icons/icon-github.svg'

export default {
  name: 'FooterCopyright',

  components: {
    IconGithub
  }
}
</script>
