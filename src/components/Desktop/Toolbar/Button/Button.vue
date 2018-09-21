<template>
  <div :class="classes" class="pointer-area flex ">
    <button
      class="btn btn--bare tool toolbar-button"
      :style="style"
      @click="handleClick"
    >
      <icon v-if="hasIcon" />
    </button>
  </div>
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
.toolbar-item {
  .toolbar-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ddd;
    overflow: visible;
    width: $toolbar-button-width-sm;
    height: 100%;
    margin: auto 0;

    @include media('md') {
      width: $toolbar-button-width-md;
    }

    @include media('lg') {
      width: $toolbar-button-width-lg;
    }

    svg {
      width: 70%;
      max-height: 100%;
    }
  }
  &.disabled .btn {
    opacity: 0.2;
  }
  &.hover:not(.disabled):not(.toolbar-item--colors) {
    background: $alt-color-lighter;
  }
}
</style>
