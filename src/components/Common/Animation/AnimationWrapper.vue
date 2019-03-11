<template>
  <component :is="'Animation'" :is-desktop="isDesktop" @sceneready="sceneReady = true">
    <slot></slot>
  </component>
</template>

<script>
import { BREAKPOINT_ANIMATION } from '@/settings'
import AnimationDesktop from '@/components/Common/Animation/AnimationDesktop.vue'
import AnimationMobile from '@/components/Common/Animation/AnimationMobile.vue'
import Animation from '@/components/Common/Animation/Animation.vue'

export default {
  name: 'AnimationWrapper',

  components: {
    Animation,
    AnimationDesktop,
    AnimationMobile
  },

  data () {
    return {
      isDesktop: false,
      sceneReady: false
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
