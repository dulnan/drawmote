<template>
  <button
    class="button tool pointer-area"
    :class="classes"
    :style="style"
    @click="handleClick"
  >
    <icon v-if="hasIcon" />
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
