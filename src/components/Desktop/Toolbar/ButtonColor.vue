<script>
import { mapState } from 'vuex'

import Button from '@/components/Desktop/Toolbar/Button.vue'

import { getRgbaString, shadeRgbColor } from '@/tools/helpers.js'

export default {
  extends: Button,

  name: 'ToolbarButtonColor',

  computed: {
    ...mapState('Brush', ['color']),

    isActive () {
      return this.color.name === this.tool.color.name
    },

    style () {
      if (!this.tool.color) {
        return {}
      }

      return {
        background: getRgbaString(this.tool.color.rgb, 1),
        color: getRgbaString(shadeRgbColor(this.tool.color.rgb, -0.2), 1),
        borderColor: getRgbaString(shadeRgbColor(this.tool.color.rgb, -0.2), 0.7)
      }
    }
  },

  methods: {
    handleClick () {
      this.$store.commit('Brush/setColor', this.tool.color)
    }
  }
}
</script>
