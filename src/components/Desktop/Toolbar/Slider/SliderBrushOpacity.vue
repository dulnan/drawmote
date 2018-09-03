<script>
import { OPACITY_MIN, OPACITY_MAX } from '@/settings'
import { THREAD_BRUSH_OPACITY } from '@/settings/drawthreads'

import Slider from '@/components/Desktop/Toolbar/Slider/Slider.vue'

export default {
  extends: Slider,

  name: 'SliderBrushOpacity',

  draw: [
    {
      threads: [THREAD_BRUSH_OPACITY],
      handler: function (state) {
        if (this.value !== state.brush.opacity) {
          this.value = state.brush.opacity
        }
      }
    }
  ],

  data () {
    return {
      min: OPACITY_MIN,
      max: OPACITY_MAX
    }
  },

  methods: {
    handleStateChange (state) {
      if (this.value !== state.brush.opacity) {
        this.value = state.brush.opacity
      }
    },

    handleValueChange (value) {
      this.$global.updateBrushOpacity(value)
    }
  }
}
</script>
