<template>
  <div class="absolute overlay background-animation">
    <svg viewBox="0 0 906 477" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g class="strokes strokes--dot">
        <g class="stroke stroke--1">
            <path d="M-31,137 C1.66666667,123.666667 46,100.666667 102,68 C186,19 334,-66 394,-113 C454,-160 588.964655,-111.627975 542,44 C491,213 248,97 109,208 C-30,319 74,543 217,579 C360,615 530,540 647,414 C725,330 762.666667,176 760,-48 L940,-14 C938,233.333333 901,402.666667 829,494 C757,585.333333 647.666667,657.333333 501,710"></path>
        </g>

        <g class="stroke stroke--2">
            <path d="M-49,410 C-10.3333333,234 56,133.333333 150,108 C291,70 194.941072,495 426,454 C657.058928,413 1009,342 1026,472 C978,748 782,369 629,121 C476,-127 117,-207 274,121 C431,449 -14,461 -49,472 C-72.3333333,479.333333 -72.3333333,458.666667 -49,410 Z"></path>
        </g>

        <g class="stroke stroke--3">
            <path d="M-33,545 C-34.3333333,505 36.3333333,495 179,515 C393,545 783,816 673,711 C599.666667,641 697.333333,404 966,-7.10542736e-15 C861.333333,-72.6666667 789.666667,-80 751,-22 C677,236 473,-51 286,44 C99,139 269,274 110,344 C4,390.666667 -51.6666667,389 -57,339 L-33,545 Z"></path>
        </g>
      </g>
      <g class="strokes strokes--trail">
        <g class="stroke stroke--1">
            <path d="M-31,137 C1.66666667,123.666667 46,100.666667 102,68 C186,19 334,-66 394,-113 C454,-160 588.964655,-111.627975 542,44 C491,213 248,97 109,208 C-30,319 74,543 217,579 C360,615 530,540 647,414 C725,330 762.666667,176 760,-48 L940,-14 C938,233.333333 901,402.666667 829,494 C757,585.333333 647.666667,657.333333 501,710"></path>
        </g>

        <g class="stroke stroke--2">
            <path d="M-49,410 C-10.3333333,234 56,133.333333 150,108 C291,70 194.941072,495 426,454 C657.058928,413 1009,342 1026,472 C978,748 782,369 629,121 C476,-127 117,-207 274,121 C431,449 -14,461 -49,472 C-72.3333333,479.333333 -72.3333333,458.666667 -49,410 Z"></path>
        </g>

        <g class="stroke stroke--3">
            <path d="M-33,545 C-34.3333333,505 36.3333333,495 179,515 C393,545 783,816 673,711 C599.666667,641 697.333333,404 966,-7.10542736e-15 C861.333333,-72.6666667 789.666667,-80 751,-22 C677,236 473,-51 286,44 C99,139 269,274 110,344 C4,390.666667 -51.6666667,389 -57,339 L-33,545 Z"></path>
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
    stroke-dashoffset: 500;
  }
}

.stroke--1 {
  stroke: $color-red;
  animation: 12s stroke_1 linear infinite;
  stroke-dasharray: 0,500;
  .strokes--trail & {
    stroke: rgba($color-red, 0.3);
    stroke-dasharray: 400,100;
  }
}

@keyframes stroke_2 {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 1200;
  }
}

.stroke--2 {
  stroke: $color-yellow;
  animation: 24s stroke_2 linear infinite;
  animation-delay: -3.5s;
  stroke-dasharray: 0,600;
  .strokes--trail & {
    stroke: rgba($color-yellow, 0.3);
    stroke-dasharray: 500,100;
  }
}

@keyframes stroke_3 {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 1000;
  }
}

.stroke--3 {
  stroke: $color-blue;
  animation: 32s stroke_3 linear infinite;
  stroke-dasharray: 0,1000;
  .strokes--trail & {
    stroke: rgba($color-blue, 0.3);
    stroke-dasharray: 900,100;
  }
}
</style>
