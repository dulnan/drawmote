<template>
  <li class="footer-connection">
    <button
      v-if="isConnected"
      class="btn btn--bare text-bold check pdg lg-pdg h-100 hover footer-text"
      @click="$store.dispatch('disconnect')"
    >
      {{ $t('footer.disconnect') }}
    </button>

    <button
      v-if="isSkipped"
      class="btn btn--bare text-bold check pdg lg-pdg h-100 hover footer-text"
      @click="$store.dispatch('unskip')"
    >
      {{ $t('footer.toPairing') }}
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

<style lang="scss"></style>
