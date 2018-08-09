<template>
  <div class="app-desktop relative overlay">
    <transition name="appear">
      <pairing v-if="!isPaired" :code="pairingCode"></pairing>
    </transition>
    <transition name="appear">
      <drawing v-if="isPaired"></drawing>
    </transition>
  </div>
</template>

<script>
import { EventBus } from '@/events'

import Pairing from '@/components/Desktop/Pairing.vue'
import Drawing from '@/components/Desktop/Drawing.vue'

export default {
  name: 'Desktop',
  components: {
    Pairing,
    Drawing
  },
  data () {
    return {
      pairingCode: '',
      isPaired: false
    }
  },
  mounted () {
    // Pressing P will skip pairing
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 80) {
        this.isPaired = !this.isPaired
      }
    })

    this.initConnection()

    EventBus.$on('isConnected', () => {
      this.isPaired = true
    })
  },

  methods: {
    async initConnection () {
      await this.$connection.registerDesktop()
      this.$connection.initPeering()
      this.pairingCode = this.$connection.code
    }
  }
}
</script>

<style scoped>
.app-desktop {
  perspective: 700px;
}

.footer {
  z-index: $index-pairing;
  top: auto;
  text-align: left;
  right: 0;
  bottom: 0;
  padding: 1rem;
  opacity: 0.5;
  font-size: 0.9rem;
}
</style>
