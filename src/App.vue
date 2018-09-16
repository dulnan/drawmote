<template>
  <div id="app" class="relative" v-if="hasLoaded">
    <mobile v-if="isRemote" />
    <desktop v-else />
    <the-footer :is-mobile="isRemote" />
  </div>
</template>

<script>
import { getViewportSize } from '@/tools/helpers'

import Desktop from '@/components/Desktop.vue'
import Mobile from '@/components/Mobile.vue'
import TheFooter from '@/components/Footer.vue'

export default {
  name: 'app',

  components: {
    Desktop,
    Mobile,
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
  min-height: 90vh;
  @include media('sm') {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    min-height: auto;
  }
}
</style>
