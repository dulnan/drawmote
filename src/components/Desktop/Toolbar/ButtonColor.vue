<script>
import Button from '@/components/Desktop/Toolbar/Button.vue'

import { getRgbaString, shadeRgbColor } from '@/tools/helpers.js'

import { THREAD_BRUSH_COLOR } from '@/settings/drawthreads'

export default {
  extends: Button,

  name: 'ToolbarButtonColor',

  draw: [
    {
      threads: [THREAD_BRUSH_COLOR],
      handler: function (state) {
        this.isActive = this.tool.color.name === state.brush.color.name
      }
    }
  ],

  computed: {
    style () {
      if (!this.tool.color) {
        return {}
      }

      return {
        background: getRgbaString(this.tool.color.rgb, 1),
        color: getRgbaString(shadeRgbColor(this.tool.color.rgb, -0.2), 0.5)
      }
    }
  },

  methods: {
    handleClick () {
      this.$global.updateBrushColor(this.tool.color)
    }
  }
}
</script>

<style lang="scss">
.toolbar-item--colors {
  width: 3rem;
  height: 3rem;
  border: 3px solid white;
  border-radius: 100%;

  &.active {
    box-shadow: 0 0px 0px 2px currentColor;
  }
}
</style>
