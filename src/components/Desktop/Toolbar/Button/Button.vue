<template>
  <button :class="classes" class="btn btn--bare pointer-area flex" @click="handleClick">
    <div
      class="toolbar-button"
      :style="style"
    >
      <icon v-if="hasIcon" />
    </div>
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
      console.log('No click handler implemented!')
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
    overflow: visible;
    font-size: $toolbar-button-width-xs;
    color: $text-color;
    width: 1em;
    height: 100%;
    margin: auto 0;

    .is-drawing & {
      @include media('sm') {
        font-size: $toolbar-button-width-sm;
      }

      @include media('md') {
        font-size: $toolbar-button-width-md;
      }

      @include media('lg') {
        font-size: $toolbar-button-width-lg;
      }
    }

    svg {
      width: 0.6em;
      max-height: 100%;
      fill: currentColor;
      .is-drawing & {
        @include media('lg') {
          width: 0.4em;
        }
      }
    }
  }
  &.disabled {
    opacity: 0.2;
    cursor: default;
  }
  &.hover:not(.disabled):not(.toolbar-item--colors) {
    background: $alt-color-lighter !important;
  }
}
</style>
