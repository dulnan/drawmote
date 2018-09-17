<template>
  <div id="app" class="relative" v-if="hasLoaded">
    <mobile v-if="isRemote" />
    <desktop v-else />
    <the-footer :is-mobile="isRemote" />
  </div>
</template>

<script>
import debouncedResize from 'debounced-resize'

import { getViewportSize } from '@/tools/helpers'
import TheFooter from '@/components/Footer.vue'

export default {
  name: 'app',

  components: {
    'desktop': () => import('@/components/Desktop.vue'),
    'mobile': () => import('@/components/Mobile.vue'),
    TheFooter
  },

  data () {
    return {
      isRemote: false,
      hasLoaded: false
    }
  },

  created () {
    this.$global.init()
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
      this.$global.updateViewport(viewport)

      if (viewport.width < 500) {
        this.isRemote = true
      }

      this.hasLoaded = true
    }
  }
}
</script>

<style lang="scss">
#app {
  background: $alt-color-lightest;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  overflow: hidden;
}
</style>
