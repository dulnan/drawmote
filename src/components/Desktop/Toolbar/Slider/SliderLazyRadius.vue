<script>
import { LAZY_RADIUS_MIN, LAZY_RADIUS_MAX } from '@/settings'
import { THREAD_LAZYRADIUS } from '@/settings/drawthreads'

import Slider from '@/components/Desktop/Toolbar/Slider/Slider.vue'

export default {
  extends: Slider,

  name: 'SliderLazyRadius',

  draw: [
    {
      threads: [THREAD_LAZYRADIUS],
      handler: function (state) {
        if (this.value !== state.lazyRadius) {
          this.value = state.lazyRadius
        }
      }
    }
  ],

  data () {
    return {
      min: LAZY_RADIUS_MIN,
      max: LAZY_RADIUS_MAX
    }
  },

  methods: {
    handleValueChange (value) {
      this.$global.updateLazyRadius(value)
    }
  }
}
</script>
