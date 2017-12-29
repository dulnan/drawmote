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
import Pairing from '@/components/Desktop/Pairing.vue'
import Drawing from '@/components/Desktop/Drawing.vue'

export default {
  name: 'Desktop',
  components: {
    Pairing,
    Drawing
  },
  sockets: {
    connect: function () {
      console.log('create Session')
      this.$socket.emit('createSession')
    },
    initialState: function (socketState) {
      console.log(socketState)
      this.pairingCode = socketState.session
    }
  },
  data () {
    return {
      pairingCode: '',
      isPaired: false
    }
  },
  mounted () {
    if (this.$socket.connected) {
      this.$socket.emit('createSession')
    }

    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 80) {
        this.isPaired = !this.isPaired
      }
    })
  }
}
</script>

<style scoped>
</style>
