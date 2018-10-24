<script>
import { OPACITY_MIN, OPACITY_MAX } from '@/settings'
import { threads } from '@/store'

import Slider from '@/components/Desktop/Toolbar/Slider/Slider.vue'

export default {
  extends: Slider,

  name: 'SliderBrushOpacity',

  loop: {
    handleOpacityChange: [threads.BRUSH_OPACITY]
  },

  data () {
    return {
      min: OPACITY_MIN,
      max: OPACITY_MAX
    }
  },

  methods: {
    handleOpacityChange (state) {
      if (this.value !== state.brush.opacity) {
        this.value = state.brush.opacity
      }
    },

    handleStateChange (state) {
      if (this.value !== state.brush.opacity) {
        this.value = state.brush.opacity
      }
    },

    handleValueChange (value) {
      this.$loop.mutate('updateBrushOpacity', value)
    }
  }
}
</script>
