<template>
  <div class="mobile">
    <the-footer />
    <transition name="appear">
      <pairing v-if="!isConnected"></pairing>
    </transition>
    <transition name="appear">
      <controlling v-if="isConnected"></controlling>
    </transition>

    <connection />
  </div>
</template>

<script>
import { EventBus } from '@/events'

import Pairing from '@/components/Mobile/Pairing.vue'
import Controlling from '@/components/Mobile/Controlling.vue'
import Connection from '@/components/Connection.vue'
import TheFooter from '@/components/Footer.vue'

export default {
  name: 'Mobile',

  components: {
    Pairing,
    Connection,
    Controlling,
    TheFooter
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
.mobile {
  padding-top: 4rem;
  height: 100%;
}
</style>
