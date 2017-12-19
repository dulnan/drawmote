<template>
  <div class="absolute pointer" v-bind:style="style"></div>
</template>

<script>
export default {
  name: 'Pointer',

  props: {
    coordinates: {
      type: Object,
      default: () => {
        return {
          x: 0,
          y: 0
        }
      }
    }
  },

  computed: {
    style: function () {
      return {
        transform: `translate(${this.coordinates.x}px, ${this.coordinates.y}px)`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pointer {
  width: 1px;
  height: 1px;
  z-index: $index-cursor;
  &:before, &:after {
    content: "";
    display: block;
    background: black;
    position: absolute;
  }
  &:before {
    width: 1px;
    height: 13px;
    left: 0;
    top: -6px;
  }
  &:after {
    width: 13px;
    height: 1px;
    top: 0;
    left: -6px;
  }
}
</style>
