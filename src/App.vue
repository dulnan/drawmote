<template>
  <div id="app" class="relative overlay">
    <router-view></router-view>
  </div>
</template>

<script>
import { getViewportSize } from '@/tools/helpers'

export default {
  name: 'App',

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
    }
  }
}
</script>

<style lang="scss">
@import 'assets/scss/main.scss';
</style>
