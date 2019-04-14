<template>
  <transition name="appear">
    <div class="controlling">
      <touch-handler />
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

  data () {
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

  mounted () {
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
  &.appear-enter-active, &.appear-leave-active {
    transition: 2s;
  }
  &.appear-enter, &.appear-leave-to {
    transform: translateY(10%);
    opacity: 0;
  }
}
</style>
