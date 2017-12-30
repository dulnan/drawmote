<template>
  <div class="absolute footer">
    Made by <a href="http://www.janhug.info">Jan Hug</a>, with help from Pascal Thormeier and others.
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
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
