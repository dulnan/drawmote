<template>
  <div class="absolute anchor" :class="{ 'is-preview': isPreview }" ref="anchor">
    <div class="absolute brush" v-bind:style="brushStyle"></div>
    <div v-if="useLazyBrush" class="absolute lazy-area" v-bind:style="lazyStyle"></div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import { getRgbaString } from '@/tools/helpers.js'

export default {
  name: 'Brush',

  draw: {
    watch: ['brush'],
    handler: function (data) {
    }
  },

  props: {
    isPreview: Boolean
  },

  computed: {
    ...mapState('Brush', [
      'color',
      'opacity',
      'hardness',
      'radius',
      'useLazyBrush'
    ]),
    ...mapGetters('Brush', [
      'lazyRadius'
    ]),
    brushStyle: function () {
      const diameter = ((this.hardness / 100) + 1) * this.radius
      return {
        background: getRgbaString(this.color.rgb, this.opacity / 100),
        filter: `blur(${((1 - (this.hardness / 100)) * this.radius)}px)`,
        width: `${diameter}px`,
        height: `${diameter}px`
      }
    },
    lazyStyle: function () {
      return {
        width: `${this.lazyRadius * 2}px`,
        height: `${this.lazyRadius * 2}px`
      }
    }
  },

  methods: {
    loop () {
      if (!this.isPreview && this.$refs.anchor) {
        this.$refs.anchor.style.transform = `translate(${this.$global.brushCoordinates.x}px, ${this.$global.brushCoordinates.y}px)`
      }

      window.requestAnimationFrame(this.loop)
    }
  },

  mounted () {
    this.loop()
  }
}
</script>

<style lang="scss" scoped>
.anchor {
  width: 1px;
  height: 1px;
  z-index: $index-brush;
  user-select: none;
  pointer-events: none;
  &.is-preview {
    position: relative;
  }
}

.brush, .lazy-area {
  border-radius: 100%;
  transform: translate(-50%, -50%);
  user-select: none;
  pointer-events: none;
}

.lazy-area {
  border: 1px solid rgba(black, 0.1);
}

.brush-string {
  transform: translate(-50%, -50%);
}
</style>
