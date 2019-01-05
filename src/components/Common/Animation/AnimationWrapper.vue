<template>
  <component :is="isDesktop ? 'AnimationDesktop' : 'AnimationMobile'" :is-desktop="isDesktop">
    <slot></slot>
  </component>
</template>

<script>
import { BREAKPOINT_ANIMATION } from '@/settings'
import AnimationDesktop from '@/components/Common/Animation/AnimationDesktop.vue'
import AnimationMobile from '@/components/Common/Animation/AnimationMobile.vue'

export default {
  name: 'AnimationWrapper',

  components: {
    AnimationDesktop,
    AnimationMobile
  },

  data () {
    return {
      isDesktop: false
    }
  },

  created () {
    if (window.innerWidth > BREAKPOINT_ANIMATION) {
      this.isDesktop = true
    }
  },

  mounted () {
  },

  beforeDestroy () {
  }
}
</script>

<style lang="scss">

</style>
