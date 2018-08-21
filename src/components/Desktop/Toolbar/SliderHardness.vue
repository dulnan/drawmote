<script>
import { HARDNESS_MIN, HARDNESS_MAX } from '@/settings'

import Slider from '@/components/Desktop/Toolbar/Slider.vue'

export default {
  extends: Slider,

  name: 'ToolbarSliderHardness',

  methods: {
    initSlider () {
      this.valueMin = HARDNESS_MIN
      this.valueMax = HARDNESS_MAX
    },

    handleValueChange (newValue) {
      this.$store.commit('Brush/setHardness', newValue)
    }
  },

  computed: {
    valueStore () {
      return 0
    }
  }
}
</script>
