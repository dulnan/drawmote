<template>
  <div id="app" class="relative overlay">
    <router-view></router-view>
    <div class="absolute footer">
      Created by <a href="http://www.janhug.info">Jan Hug</a>, with help from Pascal Thormeier and others.
    </div>
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

.footer {
  z-index: $index-footer;
  top: auto;
  text-align: center;
  right: 0;
  bottom: 0;
  padding: 1rem;
  opacity: 0.5;
  font-size: 0.9rem;
}
</style>
