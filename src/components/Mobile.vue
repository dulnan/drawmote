<template>
  <div class="mobile">
    <form v-on:submit.prevent="onSubmit">
      <input type="text" ref="pairing_id"></input>
    </form>
    <brush :coordinates="brushCoordinates" :brush="brush"></brush>
    <touch-handler v-if="isConnected"></touch-handler>
  </div>
</template>

<script>
import { DEFAULT_COLOR, RADIUS_DEFAULT } from '@/settings'

import { getViewportSize } from '@/tools/helpers.js'

import Brush from '@/components/Brush.vue'
import TouchHandler from '@/components/Mobile/TouchHandler.vue'

export default {
  name: 'Mobile',
  components: {
    Brush,
    TouchHandler
  },
  sockets: {
    connectionEstablished: function () {
      this.isConnected = true
    },
    connectionFailed: function () {
      console.log('connection FAILED')
    },
    receiveBrush: function (newBrush) {
      this.brush = newBrush
    }
  },

  data () {
    return {
      isConnected: false,
      brushCoordinates: {
        x: 0,
        y: 0
      },
      brush: {
        color: DEFAULT_COLOR,
        radius: RADIUS_DEFAULT
      }
    }
  },

  methods: {
    onSubmit () {
      const pairingId = this.$refs.pairing_id.value
      this.$socket.emit('sessionConnect', {
        session: pairingId
      })
    }
  },

  mounted () {
    const viewport = getViewportSize()
    this.brushCoordinates = {
      x: viewport.width / 2,
      y: viewport.height / 2
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
