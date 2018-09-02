<template>
  <div id="app" class="relative overlay" v-if="hasLoaded">
    <mobile v-if="isRemote" />
    <desktop v-else />
  </div>
</template>

<script>
import { getViewportSize } from '@/tools/helpers'

import Desktop from '@/components/Desktop.vue'
import Mobile from '@/components/Mobile.vue'

export default {
  name: 'app',

  components: {
    Desktop,
    Mobile
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
