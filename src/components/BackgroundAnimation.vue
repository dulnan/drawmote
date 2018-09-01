<template>
  <div class="absolute overlay background-animation">
    <svg viewBox="0 0 906 477" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g class="strokes strokes--dot">
        <g class="stroke stroke--1">
          <polygon points="-23 -181 460 680 959 -158 997 311 415 -225 -126 621 1150 329 331 771 -46 61"></polygon>
        </g>

        <g class="stroke stroke--2">
          <polygon points="523 -240 162 816 868 702 543 -240 1095 -63 -263 668 186 -54"></polygon>
        </g>

        <g class="stroke stroke--3">
          <polygon points="144 687 334 -124 759 697 994 471 969 -336 1158 93 -154 146"></polygon>
        </g>
      </g>
      <g class="strokes strokes--trail">
        <g class="stroke stroke--1">
          <polygon points="-23 -181 460 680 959 -158 997 311 415 -225 -126 621 1150 329 331 771 -46 61"></polygon>
        </g>

        <g class="stroke stroke--2">
          <polygon points="523 -240 162 816 868 702 543 -240 1095 -63 -263 668 186 -54"></polygon>
        </g>

        <g class="stroke stroke--3">
          <polygon points="144 687 334 -124 759 697 994 471 969 -336 1158 93 -154 146"></polygon>
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
@keyframes svg {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.background-animation {
  z-index: $index-background-animation;
  overflow: hidden;
  svg {
    height: 100%;
    width: 100%;
  }
  @media (max-width: 768px) {
    .stroke {
      stroke-width: 20;
    }
    svg {
      width: 100vh;
      width: auto;
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
}

.stroke {
  stroke-width: 30;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  fill-rule: evenodd;
  .strokes--trail & {
  }
}

@keyframes stroke_1 {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 2000;
  }
}

.stroke--1 {
  stroke: $color-red;
  animation: 8s stroke_1 linear infinite;
  stroke-dasharray: 0,2000;
  .strokes--trail & {
    stroke: rgba($color-red, 0.3);
    stroke-dasharray: 500,1500;
  }
}

@keyframes stroke_2 {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 2000;
  }
}

.stroke--2 {
  stroke: $color-yellow;
  animation: 8s stroke_2 linear infinite;
  animation-delay: -3.5s;
  stroke-dasharray: 0,2000;
  .strokes--trail & {
    stroke: rgba($color-yellow, 0.3);
    stroke-dasharray: 500,1500;
  }
}

@keyframes stroke_3 {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 2000;
  }
}

.stroke--3 {
  stroke: $color-blue;
  animation: 8s stroke_3 linear infinite;
  stroke-dasharray: 0,2000;
  .strokes--trail & {
    stroke: rgba($color-blue, 0.3);
    stroke-dasharray: 500,1500;
  }
}
</style>
