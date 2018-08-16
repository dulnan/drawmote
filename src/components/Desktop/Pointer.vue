<template>
  <div class="pointer" ref="anchor"></div>
</template>

<script>
export default {
  name: 'Pointer',

  methods: {
    loop () {
      if (this.$refs.anchor) {
        this.$refs.anchor.style.transform = `translate(${this.$global.pointerCoordinates.x}px, ${this.$global.pointerCoordinates.y}px)`
      }
      window.requestAnimationFrame(this.loop)
    }
  },

  mounted () {
    this.loop()
  }
}
</script>

<style lang="scss" scoped>
.pointer {
  position: fixed;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  z-index: $index-cursor;
  user-select: none;
  pointer-events: none;

  &:before, &:after {
    content: "";
    display: block;
    background: black;
    position: absolute;
    user-select: none;
    pointer-events: none;
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
