<template>
  <transition name="fade">
    <div class="controlling">
      <TouchHandler />
    </div>
  </transition>
</template>

<script>
import { DEFAULT_COLOR, RADIUS_DEFAULT } from '@/settings'

import { getViewportSize } from '@/tools/helpers.js'

import TouchHandler from '@/components/Mobile/TouchHandler.vue'

export default {
  name: 'Mobile',
  components: {
    TouchHandler
  },

  data() {
    return {
      brushCoordinates: {
        x: 0,
        y: 0
      },
      brush: {
        color: DEFAULT_COLOR,
        radius: RADIUS_DEFAULT
      }
    }
  },

  mounted() {
    const viewport = getViewportSize()
    this.brushCoordinates = {
      x: viewport.width / 2,
      y: viewport.height / 2
    }
  }
}
</script>

<style lang="scss">
.controlling {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $alt-color-darker;
  z-index: $index-footer - 1;
  &.component-fade-enter-active,
  &.component-fade-leave-active {
    transition: 1.5s;
  }
  &.component-fade-enter,
  &.component-fade-leave-to {
    opacity: 0;
    transform: translateY(6rem);
  }
}
</style>
