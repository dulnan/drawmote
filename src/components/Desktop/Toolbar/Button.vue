<template>
  <button
    class="button tool pointer-area"
    :class="classes"
    :style="style"
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

  computed: {
    iconComponent () {
      if (!this.tool.icon) {
        return null
      }

      return () => import(`@/assets/icons/${this.tool.icon}.svg`)
    }
  },

  methods: {
    handleClick () {
      if (this.tool.id === 'delete') {
        EventBus.$emit('clearCanvas')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tool {
  width: 3rem;
  height: 3rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ddd;
  background: white;
  border: 1px solid;
  border-bottom: 3px solid;
  box-shadow: inset 0 -1px 1px 0px rgba(white, 0.2),
  0 2px 2px 0px currentColor;
  border-radius: 0px;
  /* transition: 0.15s transform; */
  overflow: visible;

  /* &:after { */
  /*   content: ""; */
  /*   position: absolute; */
  /*   top: 4px; */
  /*   left: -0px; */
  /*   right: -0px; */
  /*   height: 100%; */
  /*   background: currentColor; */
  /*   z-index: -1; */
  /*   border-radius: inherit; */
  /*   [> border: inherit; <] */
  /* } */

  &.hover {
    opacity: 0.8;
  }

  &.active {
    box-shadow: inset 0 5px 4px 0px currentColor;
    border-bottom: 1px solid;
    transform: translateY(2px);
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
}
</style>
