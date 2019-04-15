<template>
  <div class="logo mrgt+">
    <div class="logo__app">
      <img src="drawmote-logo.png" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Logo'
}
</script>

<style lang="scss">
$logo-base: 768;

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0.95);
  }
}

.logo {
  font-size: 9rem;

  @include media('sm') {
    font-size: 11rem;
  }
  @include media('md') {
    font-size: 8rem;
    margin-left: -6rem;
  }
  @include media('lg') {
    // font-size: 16rem;
  }
}

.logo__app {
  position: relative;
  z-index: 1;
  width: 1em;
  height: 1em;
  background: white;
  border-radius: 0.22em;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 ((30 / $logo-base) * 1em) ((100 / $logo-base) * 1em)
      ((7 / $logo-base) * 1em) rgba(0, 0, 0, 0.04),
    0 ((1 / $logo-base) * 1em) ((4 / $logo-base) * 1em) ((2 / $logo-base) * 1em)
      rgba(0, 0, 0, 0.01);
  /* animation: 2s pulse cubic-bezier(1, -0.04, 0.63, 1.01) infinite alternate; */

  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
