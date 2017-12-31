<template>
  <div id="app" class="relative overlay">
    <router-view></router-view>
    <div class="absolute footer">
      Created by <a href="http://www.janhug.info">Jan Hug</a>, with help from Pascal Thormeier and others.
    </div>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import 'assets/scss/main.scss';
.footer {
  z-index: $index-pairing;
  top: auto;
  text-align: center;
  right: 0;
  bottom: 0;
  padding: 1rem;
  opacity: 0.5;
  font-size: 0.9rem;
}
</style>
