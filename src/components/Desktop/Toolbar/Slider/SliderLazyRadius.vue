<script>
import { LAZY_RADIUS_MIN, LAZY_RADIUS_MAX } from '@/settings'
import threads from '@/store/vuetamin/threads'

import Slider from '@/components/Desktop/Toolbar/Slider/Slider.vue'

export default {
  name: 'SliderLazyRadius',
  extends: Slider,

  vuetamin: {
    handleLazyRadiusChange: [threads.LAZYRADIUS]
  },

  data() {
    return {
      min: LAZY_RADIUS_MIN,
      max: LAZY_RADIUS_MAX,
      multiplier: 1
    }
  },

  methods: {
    handleLazyRadiusChange(state) {
      if (this.value !== state.lazyRadius) {
        this.value = state.lazyRadius
      }
    },

    handleValueChange(value) {
      this.$vuetamin.store.mutate('updateLazyRadius', value)
    }
  }
}
</script>
