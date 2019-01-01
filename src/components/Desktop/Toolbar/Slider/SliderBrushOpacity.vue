<script>
import { OPACITY_MIN, OPACITY_MAX } from '@/settings'
import threads from '@/store/vuetamin/threads'

import Slider from '@/components/Desktop/Toolbar/Slider/Slider.vue'

export default {
  extends: Slider,

  name: 'SliderBrushOpacity',

  vuetamin: {
    handleOpacityChange: [threads.BRUSH_OPACITY, threads.BRUSH]
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
      this.$vuetamin.store.mutate('updateBrushOpacity', value)
    }
  }
}
</script>
