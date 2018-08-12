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
import BrushToolbarItem from '@/components/Desktop/BrushToolbarItem.vue'

export default {
  extends: BrushToolbarItem,

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
  border-radius: 2px;
  /* box-shadow: inset 0 1px 4px 1px rgba(black, 0.1); */
  border: 1px solid rgba(black, 0.1);
  transition: 0.15s transform;

  &.hover {
    border: 0.75px solid rgba(black, 0.1);
    box-shadow: 0 4px 10px 0px rgba($color-greydark, 0.3);
    transform: scale(1.25);
    z-index: 9;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
}
</style>
