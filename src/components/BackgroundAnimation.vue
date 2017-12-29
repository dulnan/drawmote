<template>
  <div class="absolute overlay background-animation">
    <svg viewBox="0 0 906 477" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g class="strokes strokes--dot">
        <g class="stroke stroke--1">
          <path d="M-97,414 C-18,267 100,103 284,78 C468,53 514,541 697,541 C880,541 978,298 978,256"></path>
        </g>

        <g class="stroke stroke--2">
          <path d="M-135,131 C-69,284 -52.2698758,547.926607 142,579 C336.269876,610.073393 658,114 841,114 C1024,114 1129,287 1236,362"></path>
        </g>

        <g class="stroke stroke--3">
          <path d="M-91,71 C6,64 76,-19 255,71 C434,161 -115,453 235,544 C585,635 761,-276.660096 1038,-3.19744231e-13" id="Path-Copy"></path>
        </g>
      </g>
      <g class="strokes strokes--trail">
        <g class="stroke stroke--1">
          <path d="M-97,414 C-18,267 100,103 284,78 C468,53 514,541 697,541 C880,541 978,298 978,256"></path>
        </g>

        <g class="stroke stroke--2">
          <path d="M-135,131 C-69,284 -52.2698758,547.926607 142,579 C336.269876,610.073393 658,114 841,114 C1024,114 1129,287 1236,362"></path>
        </g>

        <g class="stroke stroke--3">
          <path d="M-91,71 C6,64 76,-19 255,71 C434,161 -115,453 235,544 C585,635 761,-276.660096 1038,-3.19744231e-13" id="Path-Copy"></path>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'BackgroundAnimation'
}
</script>

<style lang="scss">
.background-animation {
  z-index: $index-background-animation;
  svg {
    height: 100%;
  }
}

.stroke {
  stroke-width: 30;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  fill-rule: evenodd;
}

@keyframes stroke_1 {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 500;
  }
}

.stroke--1 {
  stroke: $color-red;
  stroke-width: 20;
  animation: 8s stroke_1 linear infinite;
  stroke-dasharray: 0,500;
  .strokes--trail & {
    opacity: 0.5;
    stroke-dasharray: 250,250;
  }
}

@keyframes stroke_2 {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 1000;
  }
}

.stroke--2 {
  stroke: $color-yellow;
  stroke-width: 20;
  animation: 5s stroke_2 linear infinite;
  stroke-dasharray: 0,1000;
  .strokes--trail & {
    opacity: 0.5;
    stroke-dasharray: 500,500;
  }
}

@keyframes stroke_3 {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 800;
  }
}

.stroke--3 {
  stroke: $color-blue;
  stroke-width: 20;
  animation: 5s stroke_3 linear infinite;
  stroke-dasharray: 0,800;
  .strokes--trail & {
    opacity: 0.5;
    stroke-dasharray: 400,400;
  }
}
</style>
