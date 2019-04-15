<script>
import { HARDNESS_MIN, HARDNESS_MAX } from '@/settings'
import threads from '@/store/vuetamin/threads'

import Slider from '@/components/Desktop/Toolbar/Slider/Slider.vue'

export default {
  name: 'SliderBrushHardness',
  extends: Slider,

  vuetamin: {
    handleHardnessChange: [threads.BRUSH_HARDNESS]
  },

  data() {
    return {
      min: HARDNESS_MIN,
      max: HARDNESS_MAX
    }
  },

  methods: {
    handleHardnessChange(state) {
      if (this.value !== state.brush.hardness) {
        this.value = state.brush.hardness
      }
    },

    handleValueChange(value) {
      this.$vuetamin.store.mutate('updateBrushHardness', value)
    }
  }
}
</script>
