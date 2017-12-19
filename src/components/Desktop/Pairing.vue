<template>
  <div class="pairing">
    <h2>{{ code }}</h2>
  </div>
</template>

<script>
export default {
  name: 'Pairing',
  props: {
    code: {
      type: String,
      default: ''
    }
  },
  mounted () {
    console.log('mounted')
  }
}
</script>

<style lang="scss" scoped>
.pairing {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
