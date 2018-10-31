<template>
  <div id="app" class="relative" v-if="hasLoaded">
    <mobile v-if="isMobile" />
    <desktop v-else />
    <the-footer :is-mobile="isMobile" />
  </div>
</template>

<script>
import debouncedResize from 'debounced-resize'

import { getViewportSize } from '@/tools/helpers'
import { BREAKPOINT_REMOTE } from '@/settings'
import TheFooter from '@/components/Common/Footer/Footer.vue'

export default {
  name: 'app',

  components: {
    'desktop': () => import('@/components/Desktop.vue'),
    'mobile': () => import('@/components/Mobile.vue'),
    TheFooter
  },

  data () {
    return {
      isMobile: false,
      hasLoaded: false
    }
  },

  mounted () {
    this.updateViewport()

    debouncedResize((e) => {
      this.updateViewport()
    })
  },

  methods: {
    updateViewport () {
      const viewport = getViewportSize()
      this.$vuetamin.store.mutate('updateViewport', viewport)

      if (!this.$connection.isConnected()) {
        this.isMobile = viewport.width < BREAKPOINT_REMOTE
        this.hasLoaded = true
      }
    }
  }
}
</script>

<style lang="scss">
#app {
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
