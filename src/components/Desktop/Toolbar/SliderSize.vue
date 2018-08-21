<script>
import { RADIUS_MIN, RADIUS_MAX } from '@/settings'

import Slider from '@/components/Desktop/Toolbar/Slider.vue'

export default {
  extends: Slider,

  name: 'ToolbarSliderSize',

  methods: {
    initSlider () {
      this.valueMin = RADIUS_MIN
      this.valueMax = RADIUS_MAX
    },

    handleValueChange (newValue) {
      this.$store.commit('Brush/setRadius', newValue)
    }
  },

  computed: {
    valueStore () {
      return 0
    }
  }
}
</script>
