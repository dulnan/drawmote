<template>
  <div id="drawmote" class="relative">
    <mobile v-if="isMobile" />
    <desktop v-else />
    <the-footer :is-mobile="isMobile" />
    <connection-timeout />
  </div>
</template>

<script>
import { BREAKPOINT_REMOTE } from '@/settings'
import TheFooter from '@/components/Common/Footer/Footer.vue'
import ConnectionTimeout from '@/components/Common/ConnectionTimeout.vue'

const IS_MOBILE = window.innerWidth < BREAKPOINT_REMOTE

export default {
  name: 'app',

  components: {
    'desktop': () => import('@/components/Desktop.vue'),
    'mobile': () => import('@/components/Mobile.vue'),
    TheFooter,
    ConnectionTimeout
  },

  data () {
    return {
      isMobile: IS_MOBILE,
      hasLoaded: false
    }
  },

  mounted () {
    document.dispatchEvent(new Event('render-event'))
  }
}
</script>

<style lang="scss">
#drawmote {
  background: $alt-color-lightest;
  @include media('sm') {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    overflow: auto;
  }
}
</style>
