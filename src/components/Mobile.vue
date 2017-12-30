<template>
  <div class="mobile overlay">
    <transition name="appear">
      <pairing v-if="!isConnected"></pairing>
    </transition>
    <transition name="appear">
      <controlling v-if="isConnected"></controlling>
    </transition>
    <footer></footer>
  </div>
</template>

<script>
import Pairing from '@/components/Mobile/Pairing.vue'
import Controlling from '@/components/Mobile/Controlling.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'Mobile',
  components: {
    Pairing,
    Controlling,
    Footer
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
  },

  methods: {
  },

  mounted () {
  }
}
</script>

<style lang="scss" scoped>
.mobile {
}
</style>
