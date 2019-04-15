<script>
import threads from '@/store/vuetamin/threads'

import Slider from '@/components/Desktop/Toolbar/Slider/Slider.vue'

import { encodeEventMessage } from '@/tools/helpers'

export default {
  name: 'SliderDistance',
  extends: Slider,

  vuetamin: {
    handleSizesChange: [threads.SIZES, threads.DISTANCE]
  },

  data() {
    return {
      min: 0,
      max: 100,
      multiplier: 7
    }
  },

  mounted() {
    this.$peersox.send(
      encodeEventMessage('distance', this.$vuetamin.store.data.gymoteDistance)
    )
  },

  methods: {
    handleSizesChange(state) {
      this.min = state.sizes.viewport.width / 4
      this.max = state.sizes.viewport.width * 2

      if (this.value !== state.gymoteDistance) {
        this.value = state.gymoteDistance
      }
    },

    handleValueChange(value) {
      this.value = value
      this.$peersox.send(encodeEventMessage('distance', value))
      this.$vuetamin.store.mutate('updateGymoteDistance', value)
    }
  }
}
</script>
