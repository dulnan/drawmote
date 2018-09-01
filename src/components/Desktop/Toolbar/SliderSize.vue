<script>
import { RADIUS_MIN, RADIUS_MAX } from '@/settings'
import { THREAD_BRUSH_RADIUS } from '@/settings/drawthreads'

import Slider from '@/components/Desktop/Toolbar/Slider.vue'

export default {
  extends: Slider,

  name: 'ToolbarSliderSize',

  draw: [
    {
      threads: [THREAD_BRUSH_RADIUS],
      handler: function (state) {
        console.log('sizeeee')
        if (this.value !== state.brush.radius) {
          this.value = state.brush.radius
        }
      }
    }
  ],

  data () {
    return {
      min: RADIUS_MIN,
      max: RADIUS_MAX
    }
  },

  methods: {
    handleValueChange (value) {
      this.$global.updateBrushRadius(value)
    }
  }
}
</script>
