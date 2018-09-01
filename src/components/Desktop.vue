<template>
  <div class="desktop relative overlay">
    <div class="desktop-container relative overlay material">
      <transition name="appear">
        <pairing v-if="!isPaired" :code="pairingCode"></pairing>
      </transition>
      <drawing v-if="isPaired"></drawing>
      <the-footer />
    </div>
  </div>
</template>

<script>
import { EventBus } from '@/events'

import Pairing from '@/components/Desktop/Pairing.vue'
import Drawing from '@/components/Desktop/Drawing.vue'
import TheFooter from '@/components/Footer.vue'

export default {
  name: 'Desktop',

  components: {
    Pairing,
    Drawing,
    TheFooter
  },

  data () {
    return {
      pairingCode: '',
      isPaired: false
    }
  },

  mounted () {
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

<style lang="scss">
.desktop {
  perspective: 700px;
  background: $color-greylight;
  padding: 2rem;
}

.desktop-container {
  background: white;
}
</style>
