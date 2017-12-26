<template>
  <div class="app-desktop relative overlay">
    <pairing :code="pairingCode"></pairing>
    <drawing></drawing>
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
      pairingCode: ''
    }
  },
  mounted () {
    if (this.$socket.connected) {
      this.$socket.emit('createSession')
    }
  }
}
</script>

<style scoped>
</style>
