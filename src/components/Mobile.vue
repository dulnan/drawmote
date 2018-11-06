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
import threads from '@/store/threads'

import Pairing from '@/components/Mobile/Pairing.vue'
import Controlling from '@/components/Mobile/Controlling.vue'

export default {
  name: 'Mobile',

  components: {
    Pairing,
    Controlling
  },

  vuetamin: {
    handleConnection: threads.CONNECTION
  },

  data () {
    return {
      isConnected: false
    }
  },

  methods: {
    handleConnection (state) {
      this.isConnected = state.connection.connected
    }
  },

  mounted () {
    this.$connection.getStoredPeerings()
  }
}
</script>
