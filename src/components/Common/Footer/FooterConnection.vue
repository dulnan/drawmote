<template>
  <li class="footer-connection">
    <button
      class="btn btn--bare text-bold check pdg lg-pdg h-100 hover"
      v-if="isConnected"
      @click="$store.dispatch('disconnect')"
    >
      Disconnect
    </button>

    <button
      class="btn btn--bare text-bold check pdg lg-pdg h-100 hover"
      v-if="isSkipped"
      @click="$store.dispatch('unskip')"
    >
      Back to pairing
    </button>
  </li>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'FooterConnection',

  computed: {
    ...mapState(['isConnected', 'isSkipped'])
  }
}
</script>

<style lang="scss">
</style>
