<template>
  <div class="absolute footer">
    Created by <a href="http://www.janhug.info">Jan Hug</a>, with help from Pascal Thormeier and others.
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style lang="scss">
.footer {
  z-index: $index-footer;
  top: auto;
  text-align: center;
  right: 0;
  bottom: 0;
  padding: 1rem;
  opacity: 0.5;
  font-size: 0.9rem;
}
</style>
