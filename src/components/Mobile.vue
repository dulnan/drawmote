<template>
  <div class="mobile h-100">
    <transition name="appear">
      <pairing v-if="!isConnected"></pairing>
    </transition>
    <transition name="appear">
      <controlling v-if="isConnected"></controlling>
    </transition>
  </div>
</template>

<script>
import { EventBus } from '@/events'

import Pairing from '@/components/Mobile/Pairing.vue'
import Controlling from '@/components/Mobile/Controlling.vue'

export default {
  name: 'Mobile',

  components: {
    Pairing,
    Controlling
  },

  data () {
    return {
      isConnected: false
    }
  },

  mounted () {
    EventBus.$on('isConnected', () => {
      this.isConnected = true
    })

    this.$connection.getStoredPeerings()
  }
}
</script>

<style lang="scss" scoped>
</style>
