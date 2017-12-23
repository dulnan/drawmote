<template>
  <div class="mobile" @touchstart="isPressing = true" @touchend="isPressing = false">
    <form v-on:submit.prevent="onSubmit">
      <input type="text" ref="pairing_id"></input>
    </form>
    <brush :coordinates="brushCoordinates" :brush="brush"></brush>
  </div>
</template>

<script>
import { DEFAULT_COLOR, RADIUS_DEFAULT } from '@/settings'

import { gyro } from '@/libs/gyro.js'
import { getViewportSize } from '@/tools/helpers.js'

import Brush from '@/components/Brush.vue'

export default {
  name: 'Mobile',
  components: {
    Brush
  },
  sockets: {
    connectionEstablished: function () {
      this.initDataLoop()
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
      isPressing: false,
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
    },

    initDataLoop () {
      gyro.frequency = 10
      gyro.startTracking((data) => {
        let alpha = data.alpha
        if (data.alpha > 180) {
          alpha = Math.abs((data.alpha - 180) - 180)
        } else {
          alpha = (180 - data.alpha) - 180
        }
        let beta = data.beta
        let gamma = data.gamma
        this.$socket.emit('sendOrientation', {
          alpha: alpha,
          beta: beta,
          gamma: gamma,
          isPressing: this.isPressing
        })
      })
    },

    dataLoop () {
      window.requestAnimationFrame(this.dataLoop)
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
