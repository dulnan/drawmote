<script>
import { threads } from '@/store'

import Slider from '@/components/Desktop/Toolbar/Slider/Slider.vue'

export default {
  extends: Slider,

  name: 'SliderDistance',

  loop: {
    handleSizesChange: [threads.SIZES],
    handleDistanceChange: [threads.DISTANCE]
  },

  data () {
    return {
      min: 0,
      max: 100,
      multiplier: 6
    }
  },

  methods: {
    handleSizesChange (state) {
      this.min = state.sizes.viewport.width / 2
      this.max = state.sizes.viewport.width * 2
    },

    handleDistanceChange (state) {
      if (this.value !== state.distance) {
        this.value = state.distance
      }
    },

    handleValueChange (value) {
      this.$loop.mutate('updateDistance', value)
    }
  }
}
</script>
