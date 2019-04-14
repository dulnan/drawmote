<template>
  <div id="drawmote" class="relative" :class="{ 'is-ready': isReady }">
    <mobile v-if="isMobile" />
    <desktop v-else />
    <restore-connection />
    <the-footer :is-mobile="isMobile" />
    <connection-timeout :is-mobile="isMobile" />
    <attribution v-if="attributionVisible" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { BREAKPOINT_REMOTE } from '@/settings'
import Desktop from '@/components/Desktop.vue'
import Mobile from '@/components/Mobile.vue'
import TheFooter from '@/components/Common/Footer/Footer.vue'
import RestoreConnection from '@/components/Common/RestoreConnection.vue'
import ConnectionTimeout from '@/components/Common/ConnectionTimeout.vue'
import Attribution from '@/components/Common/Attribution.vue'

export default {
  name: 'app',

  components: {
    Desktop,
    Mobile,
    TheFooter,
    RestoreConnection,
    ConnectionTimeout,
    Attribution
  },

  data () {
    return {
      isMobile: true,
      isReady: false
    }
  },

  computed: {
    ...mapState(['attributionVisible'])
  },

  beforeMount () {
    this.isMobile = window.innerWidth < BREAKPOINT_REMOTE
  },

  mounted () {
    this.$nextTick(() => {
      if (!window.__PRERENDERING) {
        this.isReady = true
      }

      document.dispatchEvent(new Event('render-event'))
      this.$forceUpdate()
    })
  }
}
</script>

<style lang="scss">
#drawmote {
  background: $alt-color-darker;
  opacity: 0;
  transition: 0.9s;
  &.is-ready {
    opacity: 1;
  }
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
