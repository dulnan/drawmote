<template>
  <div id="drawmote" class="relative">
    <mobile v-if="isMobile" />
    <desktop v-else />
    <restore-connection />
    <the-footer :is-mobile="isMobile" />
    <connection-timeout :is-mobile="isMobile" />
  </div>
</template>

<script>
import { BREAKPOINT_REMOTE } from '@/settings'
import Desktop from '@/components/Desktop.vue'
import Mobile from '@/components/Mobile.vue'
import TheFooter from '@/components/Common/Footer/Footer.vue'
import RestoreConnection from '@/components/Common/RestoreConnection.vue'
import ConnectionTimeout from '@/components/Common/ConnectionTimeout.vue'

export default {
  name: 'app',

  components: {
    Desktop,
    Mobile,
    TheFooter,
    RestoreConnection,
    ConnectionTimeout
  },

  data () {
    return {
      isMobile: true,
      hasLoaded: false
    }
  },

  beforeMount () {
    this.isMobile = window.innerWidth < BREAKPOINT_REMOTE
  },

  mounted () {
    this.$nextTick(() => {
      document.dispatchEvent(new Event('render-event'))
      this.$forceUpdate()
    })
  }
}
</script>

<style lang="scss">
#drawmote {
  background: white;
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
