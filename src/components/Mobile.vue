<template>
  <div class="mobile overlay">
    <transition name="appear">
      <pairing v-if="!isConnected"></pairing>
    </transition>
    <transition name="appear">
      <controlling v-if="isConnected"></controlling>
    </transition>
  </div>
</template>

<script>
import Pairing from '@/components/Mobile/Pairing.vue'
import Controlling from '@/components/Mobile/Controlling.vue'

export default {
  name: 'Mobile',

  components: {
    Pairing,
    Controlling
  },

  sockets: {
    connectionEstablished: function () {
      this.isConnected = true
    },
    connectionFailed: function () {
      console.log('connection FAILED')
    }
  },

  data () {
    return {
      isConnected: false
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile {
}
</style>
