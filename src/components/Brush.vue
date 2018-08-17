<template>
  <div class="absolute anchor" :class="{ 'is-preview': isPreview }" ref="anchor">
    <div class="absolute brush" v-bind:style="brushStyle"></div>
    <div v-if="useLazyBrush" class="absolute lazy-area" v-bind:style="lazyStyle"></div>

    <svg
      class="absolute brush-string"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      :viewBox="svgAttributes.viewBox"
      :width="svgAttributes.diameter"
      :height="svgAttributes.diameter">
      <g style="transform: translate(50%, 50%)">
        <path
          ref="svgPath"
          d=""
          fill="none"
          vector-effect="non-scaling-stroke"
          stroke-width="1"
          stroke="rgb(0,0,0)"
          stroke-linejoin="miter"
          stroke-linecap="square"
          stroke-miterlimit="3"/>
      </g>
    </svg>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import { getRgbaString } from '@/tools/helpers.js'

export default {
  name: 'Brush',

  props: {
    isPreview: Boolean
  },

  computed: {
    svgAttributes () {
      const diameter = this.lazyRadius * 2
      return {
        viewBox: `0 0 ${diameter} ${diameter}`,
        diameter: diameter
      }
    },
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

      const offsetX = this.$global.pointerCoordinates.x - this.$global.brushCoordinates.x - this.$global.canvasRect.left
      const offsetY = this.$global.pointerCoordinates.y - this.$global.brushCoordinates.y - this.$global.canvasRect.top

      const curveX = Math.abs(offsetX - this.lazyRadius)
      const curveY = Math.abs(offsetX - this.lazyRadius)

      console.log(offsetX)

      this.$refs.svgPath.setAttribute('d', ` M ${0} ${0}, Q ${curveX} ${curveY}, ${offsetX} ${offsetY}`)

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
