<script>
import { RADIUS_MIN, RADIUS_MAX } from '@/settings'
import { threads } from '@/store'

import Slider from '@/components/Desktop/Toolbar/Slider/Slider.vue'

export default {
  extends: Slider,

  name: 'SliderBrushRadius',

  loop: {
    handleRadiusChange: [threads.BRUSH_RADIUS]
  },

  data () {
    return {
      min: RADIUS_MIN,
      max: RADIUS_MAX
    }
  },

  methods: {
    handleRadiusChange (state) {
      if (this.value !== state.brush.radius) {
        this.value = state.brush.radius
      }
    },

    handleValueChange (value) {
      this.$loop.mutate('updateBrushRadius', value)
    }
  }
}
</script>
