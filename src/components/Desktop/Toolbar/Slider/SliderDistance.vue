<script>
import { THREAD_DISTANCE, THREAD_SIZES } from '@/settings/drawthreads'

import Slider from '@/components/Desktop/Toolbar/Slider/Slider.vue'

export default {
  extends: Slider,

  name: 'SliderDistance',

  draw: [
    {
      threads: [THREAD_SIZES],
      handler: function (state) {
        this.min = state.sizes.viewport.width / 2
        this.max = state.sizes.viewport.width * 2
      }
    },
    {
      threads: [THREAD_DISTANCE],
      handler: function (state) {
        if (this.value !== state.distance) {
          this.value = state.distance
        }
      }
    }
  ],

  data () {
    return {
      min: 0,
      max: 100,
      multiplier: 6
    }
  },

  methods: {
    handleValueChange (value) {
      this.$global.updateDistance(value)
    }
  }
}
</script>
