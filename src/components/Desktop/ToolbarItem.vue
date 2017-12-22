<template>
  <button
    type="button"
    class="button toolbar__button"
    v-bind:style="{ background: color.hex }"
    v-bind:class="{ 'active' : active }"
    @click.prevent="changeColor(color)"
  ></button>
</template>

<script>
export default {
  name: 'ToolbarItem',

  props: {
    type: {
      type: String,
      default: 'color'
    },
    active: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    buttonStyle: function () {
      let style = {}
      if (this.type === 'color') {
        style.background =
      }
      return {
        background:
      }
    }
  },

  methods: {
    changeColor (newColor) {
      this.$emit('setBrushColor', newColor)
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  height: 5rem;
  width: 100%;
  background: rgba(black, 0.1);
  z-index: $index-toolbar;
}

.toolbar__button {
  border-radius: 100%;
  width: 5rem;
  height: 5rem;
}
</style>
