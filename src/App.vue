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
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'App',

  computed: {
    ...mapState('App', [
      'viewport',
      'canvasRect',
      'toolbarRect'
    ]),
    ...mapState('Brush', [
      'useLazyBrush'
    ]),
    ...mapGetters('Brush', [
      'lazyRadius'
    ])
  },

  watch: {
    viewport (viewport) {
      this.$global.updateViewport(viewport)
    },

    canvasRect (rect) {
      this.$global.updateCanvasRect(rect)
    },

    toolbarRect (rect) {
      this.$global.updateToolbarRect(rect)
    },

    useLazyBrush (useLazyBrush) {
      this.$global.updateUseLazyBrush(useLazyBrush)
    },

    lazyRadius (lazyRadius) {
      this.$global.updateLazyRadius(lazyRadius)
    }
  },

  created () {
    this.$global.init()
    this.$global.updateLazyRadius(this.lazyRadius)
  },

  mounted () {
    this.updateViewport()
  },

  methods: {
    updateViewport () {
      const viewport = getViewportSize()
      this.$store.commit('App/setViewport', viewport)
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
