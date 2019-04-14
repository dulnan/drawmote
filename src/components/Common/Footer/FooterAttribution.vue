<template>
  <li class="footer-attribution">
    <button
      class="btn btn--bare text-bold pdg lg-pdg h-100 hover footer-text"
      @click="$store.dispatch('toggleAttributionVisibility')"
    >
      <span class="arrow-after">Attribution</span>
    </button>
  </li>
</template>

<script>
export default {
  name: 'FooterAttribution'
}
</script>

<style lang="scss">

</style>
