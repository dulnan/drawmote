<template>
  <button
    class="button tool pointer-area"
    :class="classes"
    :style="style"
    @click="handleClick"
  >
    <component v-if="iconComponent" :is="iconComponent" />
  </button>
</template>

<script>
import { EventBus } from '@/events'

import ToolbarItem from '@/components/Desktop/Toolbar/Item.vue'

export default {
  extends: ToolbarItem,

  name: 'BrushToolbarTool',

  data () {
    return {
      isActive: false
    }
  },

  computed: {
    iconComponent () {
      if (!this.tool.icon) {
        return null
      }

      return () => import(`@/assets/icons/${this.tool.icon}.svg`)
    }
  },

  methods: {
    handleClick (state) {
    }
  },

  created () {
    const eventName = 'pointerOver_' + this.itemKey
    EventBus.$on(eventName, this.handleClick)
  }
}
</script>

<style lang="scss">

</style>
