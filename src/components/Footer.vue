<template>
  <div class="footer">
    <ul class="list-inline list-inline--divided text-small">
      <li class="pdg"><span class="text-bold">drawmote.app</span></li>
      <li class="pdg flex-1 text-center hidden-sm-down">Made by <a href="http://www.janhug.info">Jan Hug</a>, with help from Pascal Thormeier and others.</li>
      <li class="pdg text-bold mrgla"><a href="https://github.com/dulnan/drawmote-client">View on GitHub</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style lang="scss">
.footer {
  position: fixed;
  background: $alt-color-lighter;
  z-index: $index-footer;
  top: 0;
  right: 0;
  left: 0;
  border-bottom: $list-separator-style;
  @include media('sm') {
    top: auto;
    bottom: 0;
    border-bottom: 0;
    border-top: $list-separator-style;
  }
}
</style>
