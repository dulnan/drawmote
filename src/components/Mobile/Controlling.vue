<template>
  <div class="controlling">
    <brush :coordinates="brushCoordinates" :brush="brush"></brush>
    <touch-handler></touch-handler>
  </div>
</template>

<script>
import { DEFAULT_COLOR, RADIUS_DEFAULT } from '@/settings'

import { getViewportSize } from '@/tools/helpers.js'

import Brush from '@/components/Brush.vue'
import TouchHandler from '@/components/Mobile/TouchHandler.vue'

export default {
  name: 'Mobile',
  components: {
    Brush,
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

  methods: {
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

<style lang="scss" scoped>
</style>
