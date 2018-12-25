<template>
  <div class="animation" :style="animationStyle">
    <div class="animation__world" ref="world">
      <div class="animation__scene" ref="scene" :style="sceneStyle">
        <div class="stand"></div>
        <div class="floor"></div>
        <div class="screen" :style="screenStyle">
          <div class="screen__side"></div>
          <div class="screen__side"></div>
          <div class="screen__side"></div>
          <div class="screen__side"></div>
          <div class="screen__display" :style="displayStyle">
            <drawing />
          </div>
        </div>
        <div class="phone" :style="phoneStyle" ref="phone">
          <div class="phone__side"></div>
          <div class="phone__side"></div>
          <div class="phone__side"></div>
          <div class="phone__side"></div>
          <div class="phone__button"></div>
          <div class="phone__laser" ref="laser" :style="laserStyle"></div>
          <div class="phone__display">
            <img src="drawmote-logo.png" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GyroPlane } from 'gyro-plane'
import anime from 'animejs'

import BackgroundAnimation from '@/components/Common/BackgroundAnimation.vue'
import Drawing from '@/components/Desktop/Drawing.vue'

import debouncedResize from 'debounced-resize'

const record = require('./record.json')

let timeouts = []
let animationFrame = null

let frames = {
  screen: {
    translateZ: {
      initial: '1.1em',
      side: '-2.3em',
      full: '0em'
    },
    rotateX: {
      initial: -90,
      side: -20,
      full: 0
    },
    translateX: {
      initial: '0em',
      side: '0.45em',
      full: '0em'
    },
    translateY: {
      initial: '-1.7em',
      side: '-0.05em',
      full: '0em'
    },
    rotateY: {
      initial: 0,
      side: -58,
      full: 0
    }
  }
}

export default {
  name: 'Animation',

  components: {
    BackgroundAnimation,
    Drawing
  },

  data () {
    return {
      alpha: 180,
      beta: 0,

      windowWidth: 1200,
      windowHeight: 900,

      gyro: new GyroPlane({
        width: 500,
        height: 500,
        distance: 700
      }),

      count: 0,

      sceneX: -90,
      sceneY: -0,
      sceneZ: 0,

      mouseEnabled: false,

      vuetaminState: {}
    }
  },

  computed: {
    brush () {
      this.gyro.updateOrientation({ alpha: this.alpha, beta: this.beta })

      // To get the calculated coordinates, you have to call this function.
      return this.gyro.getScreenCoordinates()
    },

    base () {
      return this.windowWidth
    },

    width () {
      return this.base + 2 * this.bezelWidth
    },

    height () {
      return (this.windowHeight) + 2 * this.bezelWidth
    },

    bezelWidth () {
      return this.base * 0.03
    },

    distance () {
      return this.base
    },

    animationStyle () {
      return {
        fontSize: this.base + 'px'
      }
    },

    displayStyle () {
      return {
        top: `${this.bezelWidth}px`,
        right: `${this.bezelWidth}px`,
        left: `${this.bezelWidth}px`,
        bottom: `${this.bezelWidth}px`
      }
    },

    laserStyle () {
      return {
        height: `${this.distance}px`,
        top: `-${this.distance}px`
      }
    },

    screenStyle () {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`
      }
    },

    phoneStyle () {
      return {
        transform: `
          translateZ(${this.distance}px)
          rotateX(${-this.beta + 90}deg)
          rotateZ(${180 - this.alpha}deg)
        `
      }
    },

    sceneStyle () {
      return {
        transformOrigin: `50% 50% ${this.distance * 0.1}px`
      }
    }
  },

  watch: {
    distance (distance) {
      this.updateScreenSize()
    },

    width (width) {
      this.updateScreenSize()
    },

    height (height) {
      this.updateScreenSize()
    },

    brush (coordinates) {
      this.$vuetamin.store.mutate('updatePointer', { coordinates })
    }
  },

  methods: {

    updateScreenSize () {
      this.gyro.setDistance(this.distance)
      this.gyro.setDistance(this.distance)
      this.gyro.setScreenDimensions({ width: this.width, height: this.height })
    },

    animate () {
      const easing = 'easeInOutQuad'

      anime({
        targets: this.$refs.laser,
        scaleY: [
          { value: 0, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: 1, duration: 300, delay: 2400, elasticity: 7, easing: easing }
        ]
      })

      return anime({
        targets: this.$refs.scene,
        translateZ: [
          { value: frames.screen.translateZ.initial, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateZ.side, duration: 6000, delay: 1000, elasticity: 2, easing: easing }
        ],

        rotateX: [
          { value: frames.screen.rotateX.initial, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.rotateX.side, duration: 7000, delay: 0, elasticity: 50, easing: easing }
        ],

        translateX: [
          { value: frames.screen.translateX.initial, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateX.side, duration: 5000, delay: 2000, elasticity: 50, easing: easing }
        ],

        translateY: [
          { value: frames.screen.translateY.initial, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateY.side, duration: 3000, delay: 0, elasticity: 100, easing: easing }
        ],
        rotateY: [
          { value: frames.screen.rotateY.initial, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.screen.rotateY.side, duration: 5000, delay: 2000, elasticity: 7, easing: easing }
        ]
      })
    },

    animateFullscreen () {
      window.cancelAnimationFrame(animationFrame)
      this.mouseEnabled = false
      this.$vuetamin.store.mutate('updateIsPressing', { isPressing: false })

      const easing = 'easeInOutQuad'

      const startTranslateZ = `${this.distance}px`
      const startRotateX = -this.beta + 90
      const startRotateZ = 180 - this.alpha

      let movePhone = anime({
        targets: this.$refs.phone,
        translateZ: [
          { value: startTranslateZ, duration: 0, delay: 0, elasticity: 0 },
          { value: '1000px', duration: 3000, delay: 0, elasticity: 2, easing: easing }
        ],

        rotateX: [
          { value: startRotateX, duration: 0, delay: 0, elasticity: 0 },
          { value: 120, duration: 3000, delay: 0, elasticity: 50, easing: easing }
        ],

        rotateZ: [
          { value: startRotateZ, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: 0, duration: 3000, delay: 0, elasticity: 7, easing: easing }
        ],

        translateY: [
          { value: '0em', duration: 0, delay: 0, elasticity: 0 },
          { value: '2em', duration: 3000, delay: 0, elasticity: 2, easing: easing }
        ]
      })

      return anime({
        targets: this.$refs.scene,
        translateZ: [
          { value: frames.screen.translateZ.side, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateZ.full, duration: 3000, delay: 1000, elasticity: 2, easing: easing }
        ],

        rotateX: [
          { value: frames.screen.rotateX.side, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.rotateX.full, duration: 2000, delay: 500, elasticity: 50, easing: easing }
        ],

        translateX: [
          { value: frames.screen.translateX.side, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateX.full, duration: 2000, delay: 500, elasticity: 50, easing: easing }
        ],

        translateY: [
          { value: frames.screen.translateY.side, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateY.full, duration: 2000, delay: 0, elasticity: 100, easing: easing }
        ],
        rotateY: [
          { value: frames.screen.rotateY.side, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.screen.rotateY.full, duration: 2000, delay: 0, elasticity: 7, easing: easing }
        ]
      })
    },

    setOrientation (x, y) {
      this.alpha = (27) * -(x - (800 / 2)) / (800 / 2) + 180
      this.beta = (27) * -(y - (800 / 2)) / (800 / 2)
    },

    onMouseMove (e) {
      if (!this.mouseEnabled) {
        return
      }
      e.preventDefault()
      this.setOrientation(e.pageX, e.pageY)
    },

    onMouseDown (e) {
      if (!this.mouseEnabled) {
        return
      }
      e.preventDefault()
      this.$vuetamin.store.mutate('updateIsPressing', { isPressing: true })
    },

    onMouseUp (e) {
      if (!this.mouseEnabled) {
        return
      }
      e.preventDefault()
      this.$vuetamin.store.mutate('updateIsPressing', { isPressing: false })
    },

    updateSizes () {
      this.windowWidth = window.innerWidth
      this.windowHeight = window.innerHeight
    },

    loop () {
      // Stop the animation loop when the end of the array is reached.
      if ((this.count) > record.length) {
        this.$vuetamin.store.mutate('updateBrushRadius', this.vuetaminState.brush.radius)
        this.$vuetamin.store.mutate('updateLazyRadius', this.vuetaminState.lazyRadius)

        this.mouseEnabled = true

        return
      }

      const type = record[this.count]
      const alpha = record[this.count + 1] / 10
      const beta = record[this.count + 2] / 10

      this.alpha = alpha
      this.beta = beta

      if (type === 1 || type === 2) {
        const isPressing = type === 1
        this.$vuetamin.store.mutate('updateIsPressing', { isPressing })
      }

      this.count = this.count + 3

      animationFrame = window.requestAnimationFrame(this.loop.bind(this))
    },

    pushRecord (type) {
      const alpha = Math.round(this.alpha * 10)
      const beta = Math.round(this.beta * 10)
      this.record.push(type, alpha, beta)
    }
  },

  mounted () {
    this.updateSizes()
    debouncedResize((e) => {
      this.updateSizes()
    })

    this.gyro.updateOffset({ alpha: this.alpha, beta: this.beta })
    this.updateScreenSize()

    this.vuetaminState = this.$vuetamin.store.getState()

    this.$vuetamin.store.mutate('updateLazyRadius', 40 * (this.windowWidth / 800))
    this.$vuetamin.store.mutate('updateBrushRadius', 4 * (this.windowWidth / 800))

    this.loop()

    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mousedown', this.onMouseDown)
    window.addEventListener('mouseup', this.onMouseUp)
  },

  beforeDestroy () {
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('mousedown', this.onMouseDown)
    window.removeEventListener('mouseup', this.onMouseUp)

    timeouts.forEach(timeout => {
      window.clearTimeout(timeout)
    })

    window.cancelAnimationFrame(animationFrame)
  }
}
</script>

<style lang="scss">

.debug {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 30rem;
  padding: 4rem;
  z-index: 99999;
  font-size: 1rem;
  input {
    margin-top: 0;
    margin-bottom: 1rem;
  }
  label {
    font-weight: bold;
    display: block;
    margin: 1rem 0 0;
  }
}

$timing-function: cubic-bezier(0.72,-0.04, 0.32, 1.06);
$wireframe-border: 2px solid rgb(175, 175, 175);

$animation-base: 900;
$perspective: 2;
$animation-phone-distance: 1;

$phone-translate-z: var(--animation-phone-distance);

$movement-transition: 1.8s;

$screen-border-width: 0.03;

@function b($multiplier) {
  @return $multiplier * 1em;
}

@mixin sides ($depth) {
  position: absolute;
  &:nth-child(1) {
    top: 0;
    left: 0;
    width: 100%;
    height: $depth;
    transform: rotateX(-90deg);
    transform-origin: top left;
    border-top-width: 0;
  }
  &:nth-child(2) {
    bottom: 0;
    left: 0;
    width: 100%;
    height: $depth;
    transform: rotateX(90deg);
    transform-origin: bottom left;
  }
  &:nth-child(3) {
    top: 0;
    left: 0;
    height: 100%;
    width: $depth;
    transform: rotateY(90deg);
    transform-origin: top left;
  }
  &:nth-child(4) {
    top: 0;
    right: 0;
    height: 100%;
    width: $depth;
    transform: rotateY(-90deg);
    transform-origin: top right;
  }
}

.animation {
  position: relative;
  pointer-events: none;
  width: b(1);
  height: b(1);
  position: absolute;
  z-index: 499;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.animation__world {
  perspective: b($perspective);
  transform-style: preserve-3d;
}

.animation__scene {
  width: b(1);
  height: b(1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transform: translateZ(1.1em) rotateX(-90deg) translateY(-1.7em);
  transform-style: preserve-3d;
}

.phone {
  width: b(0.1);
  height: b(0.2);
  background: #fafafa;
  border: $wireframe-border;
  transform-style: preserve-3d;
  position: relative;
}

.phone__laser {
  position: absolute;
  top: b(-1.15);
  left: calc(50% - 1px);
  width: 3px;
  background: $color-red;
  box-shadow: 0 0 1px 2px $color-red;
  opacity: 0.3;
  transform: translateZ(b(-0.005));
  transform-origin: bottom;
}

.floor {
  width: b(2.8);
  height: b(2);
  background: white;
  position: absolute;
  z-index: 0;
  bottom: 0;
  left: b(-1);
  border: 4px solid #ddd;
  transform: rotateX(90deg) translateZ(-2px) translateY(b(1.5));
  transform-origin: bottom;
}

.phone__button {
  position: absolute;
  bottom: b(0.01);
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: $wireframe-border;
  border-radius: 100%;
  width: b(0.025);
  height: b(0.025);
}

.phone__side {
  background: #efefef;
  border: $wireframe-border;
  @include sides(b(0.005));
}

.phone__display {
  position: absolute;
  z-index: 10000000;
  top: b(0.015);
  left: b(0.005);
  bottom: b(0.025);
  right: b(0.005);
  background: white;
  border: $wireframe-border;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 1px 1px rgba(#ccc, 0.2);
  &:before {
    content: "";
    position: absolute;
    z-index: 0;
    top: b(-0.008);
    left: 50%;
    transform: translateX(-50%);
    width: b(0.02);
    height: b(0.002);
    background: #bbb;
    border-radius: 2rem;
  }
  img {
    max-width: 70%;
    margin: 0 auto;
    display: block;
    border: 1px solid $alt-color-light;
    border-radius: 23%;
  }
}

.screen {
  background: white;
  position: absolute;
  pointer-events: none;
  top: 50%;
  left: 50%;
  // border: $wireframe-border;
  box-shadow: inset 0 0px 0px 2px #999;
  transform: translate(-50%, -50%);
  transform-style: preserve-3d;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stand {
  position: absolute;
  background: white;
  border: $wireframe-border;
  bottom: 0;
  width: b(0.4);
  left: 50%;
  height: b(0.44);
  border-radius: b(0.1) b(0.1) 0 0;
  transform: translateX(-50%) rotateX(-90deg) translateY(b(0.3));
  transform-origin: bottom center;
  box-shadow: 3px -3px 8px 1px rgba(#ccc, 0.2);
  transform-style: preserve-3d;
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: $wireframe-border;
    background: white;
    transform: rotateX(60deg);
    transform-origin: bottom;
  }
}

.screen__display {
  content: "";
  position: absolute;
  box-shadow: 0 0px 0px 2px #999;
  // border: b($screen-border-width) solid #fafafa;
  border-radius: 4px;
  z-index: 400;
  overflow: hidden;
}

.screen__side {
  background: white;
  border: $wireframe-border;
  @include sides(b(0.05));

  &:nth-child(1) {
    // background: linear-gradient(90deg,
    // #a1a5ab,
    // #c2c5cb)
  }
}

.phone__brush {
  width: b(0.1);
  height: b(0.1);
  border-radius: 100%;
  background: #eee;
  box-shadow: inset 0px 0px 1px 2px #ddd;
  position: relative;
  z-index: 100;
}
</style>
