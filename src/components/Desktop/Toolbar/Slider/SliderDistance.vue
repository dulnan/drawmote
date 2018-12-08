<script>
import threads from '@/store/threads'

import Slider from '@/components/Desktop/Toolbar/Slider/Slider.vue'

import { encodeEventMessage } from '@/tools/helpers'

export default {
  extends: Slider,

  name: 'SliderDistance',

  vuetamin: {
    handleSizesChange: [threads.SIZES]
  },

  data () {
    return {
      min: 0,
      max: 100,
      multiplier: 7
    }
  },

  methods: {
    handleSizesChange (state) {
      this.min = state.sizes.viewport.width / 4
      this.max = state.sizes.viewport.width * 2
    },

    handleValueChange (value) {
      this.value = value
      this.$peersox.send(encodeEventMessage('distance', value))
    }
  },

  mounted () {
    this.handleValueChange(window.innerWidth)
  }
}
</script>
