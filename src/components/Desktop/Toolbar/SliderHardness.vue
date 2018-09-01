<script>
import { HARDNESS_MIN, HARDNESS_MAX } from '@/settings'
import { THREAD_BRUSH_HARDNESS } from '@/settings/drawthreads'

import Slider from '@/components/Desktop/Toolbar/Slider.vue'

export default {
  extends: Slider,

  name: 'ToolbarSliderHardness',

  draw: [
    {
      threads: [THREAD_BRUSH_HARDNESS],
      handler: function (state) {
        if (this.value !== state.brush.hardness) {
          this.value = state.brush.hardness
        }
      }
    }
  ],

  data () {
    return {
      min: HARDNESS_MIN,
      max: HARDNESS_MAX
    }
  },

  methods: {
    handleValueChange (value) {
      this.$global.updateBrushHardness(value)
    }
  }
}
</script>
