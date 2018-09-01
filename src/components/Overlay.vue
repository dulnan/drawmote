<template>
  <transition name="appear">
    <div v-if="visible" class="absolute overlay page-overlay" @click.prevent="hideOverlay()"></div>
  </transition>
</template>

<script>
import { EventBus } from '@/events'

export default {
  name: 'Overlay',

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    hideOverlay () {
      EventBus.$emit('hideOverlay')
    }
  }
}
</script>

<style lang="scss" scoped>
.page-overlay {
  z-index: $index-overlay;
  background: rgba(white, 0.8);

  &.appear-enter-active, &.appear-leave-active {
    transition: .5s;
  }
  &.appear-enter, &.appear-leave-to {
    opacity: 0;
  }
}
</style>
