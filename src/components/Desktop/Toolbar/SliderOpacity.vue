<script>
import { OPACITY_MIN, OPACITY_MAX } from '@/settings'

import Slider from '@/components/Desktop/Toolbar/Slider.vue'

export default {
  extends: Slider,

  name: 'ToolbarSliderOpacity',

  methods: {
    initSlider () {
      this.valueMin = OPACITY_MIN
      this.valueMax = OPACITY_MAX
    },

    handleValueChange (newValue) {
      this.$store.commit('Brush/setOpacity', newValue)
    }
  },

  computed: {
    valueStore () {
      return this.$store.state.Brush.opacity
    }
  }
}
</script>
