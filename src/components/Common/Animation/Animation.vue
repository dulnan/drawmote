<template>
  <transition
    v-on:enter="onEnter"
    v-on:appear="onEnter"
    v-on:leave="onLeave"
  >
  <div
    class="animation"
    :class="{ 'is-desktop': isDesktop }"
    ref="animation"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <div class="animation__slot" ref="slot">
      <slot></slot>
    </div>
    <div class="seek" v-if="showDebug">
      <input type="range" min="0" max="100" step="0.1" v-model="seek" />
    </div>
    <div class="animation__debug" v-if="showDebug">
      <label>Base</label>
      <input type="range" min="400" max="2000" step="1" v-model.number="base">
      <input type="number" v-model="base"/>

      <label>Alpha</label>
      <input type="range" min="120" max="240" step="1" v-model.number="alpha">
      <input type="number" v-model="alpha"/>

      <label>Beta</label>
      <input type="range" min="-180" max="180" step="1" v-model.number="beta">
      <input type="number" v-model="beta"/>

      <label>Scene X</label>
      <input type="range" min="-180" max="180" step="1" v-model.number="sceneX">
      <input type="number" v-model="sceneX"/>

      <button @click="updateScreenSize">updateScreenSize</button>
      <button @click="setOrientation(600, 400)">set orientation</button>
    </div>

    <div class="animation__stage" :style="animationStyle" :class="{ 'is-pairing': !isDrawing }">
      <div class="animation__world" ref="world">
        <div class="animation__scene" ref="scene" :style="sceneStyle">
          <div class="stand" v-show="sceneVisible"></div>
          <div class="floor" v-show="sceneVisible"></div>
          <div class="screen" :style="screenStyle">
            <div class="screen__side" v-show="sceneVisible"></div>
            <div class="screen__side" v-show="sceneVisible"></div>
            <div class="screen__side" v-show="sceneVisible"></div>
            <div class="screen__side" v-show="sceneVisible"></div>
            <div class="screen__display" :style="displayStyle">
              <div class="screen__circle" ref="circle"></div>
              <drawing :connected="true" />
            </div>
          </div>
          <div class="phone" :style="phoneStyle" ref="phone" v-if="sceneVisible">
            <div class="phone__side"></div>
            <div class="phone__side"></div>
            <div class="phone__side"></div>
            <div class="phone__side"></div>
            <div class="phone__button"></div>
            <div class="phone__laser" ref="laser" :style="laserStyle"></div>
            <div class="phone__display">
              <div class="phone__logo" ref="logo">
                <img src="drawmote-logo.png" ref="logoImage" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>
import { GyroPlane } from 'gyro-plane'

import BackgroundAnimation from '@/components/Common/BackgroundAnimation.vue'
import Drawing from '@/components/Desktop/Drawing.vue'

let animationFrame = null

let animeAnimations = []

export default {
  name: 'Animation',

  components: {
    BackgroundAnimation,
    Drawing
  },

  props: {
    isDrawing: Boolean,
    isDesktop: Boolean
  },

  data () {
    return {
      seek: 100,
      seekFull: 100,
      showDebug: false,

      timeouts: [],

      screenAppeared: false,

      alpha: 180,
      beta: 0,

      windowWidth: 900,
      windowHeight: 506,

      gyro: new GyroPlane({
        width: 900,
        height: 506,
        distance: 400
      }),

      count: 0,

      sceneX: -90,
      sceneY: -0,
      sceneZ: 0,

      scale: 1,

      mouseEnabled: false,
      sceneVisible: true,

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
      return this.width
    },

    displayStyle () {
      return {
        width: `${this.windowWidth}px`,
        height: `${this.windowHeight}px`
      }
    },

    laserStyle () {
      return {
        height: `${this.distance * 1.01}px`,
        top: `-${this.distance * 1.01}px`
      }
    },

    screenStyle () {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`
      }
    },

    phoneStyle () {
      if (!this.screenAppeared) {
        return {}
      }
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
    seek (seek) {
      this.animationLeave.seek(this.animationLeave.duration * (seek / 100))
    },

    seekFull (seek) {
      this.animationFullscreen.seek(this.animationFullscreen.duration * (seek / 100))
    },

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
      if (coordinates) {
        this.$vuetamin.store.mutate('updatePointer', {
          coordinates: {
            x: coordinates.x - this.bezelWidth, y: coordinates.y - this.bezelWidth
          }
        })
      }
    },

    isDrawing (isDrawing) {
      animeAnimations.forEach(animation => {
        animation.reset()
      })
      animeAnimations = []

      if (isDrawing) {
        this.animateLeave()
      } else {
        this.animateEnter()
      }
    }
  },

  methods: {
    handleTouchStart () {
      this.$vuetamin.store.mutate('updateIsPressing', {
        isPressing: true,
        fromMouse: true
      })
    },

    handleTouchEnd () {
      this.$vuetamin.store.mutate('updateIsPressing', {
        isPressing: false,
        fromMouse: true
      })
    },

    onEnter (el, done) {
      this.animateEnter()
      // this.animationEnter.seek(this.animationEnter.duration * (this.seek / 100))

      this.animationEnter.finished.then(() => {
        done()
      })
    },

    onLeave (el, done) {
      this.animateLeave()

      this.animationLeave.finished.then(() => {
        done()
      })
    },

    cancelAnimations () {
      this.clearTimeouts()
    },

    clearTimeouts () {
      this.timeouts.forEach(timeout => {
        window.clearTimeout(timeout)
      })
    },

    updateScreenSize () {
      this.gyro.setDistance(this.distance)
      this.gyro.setScreenDimensions({ width: this.width, height: this.height })
    },

    setOrientation (x, y) {
      const base = 800
      this.alpha = (27) * -(x - (base / 2)) / (base / 2) + 180
      this.beta = (27) * -(y - (base / 2)) / (base / 2)
    },

    updateSizes () {
      this.windowWidth = window.innerWidth
      this.windowHeight = window.innerHeight
    },

    pushRecord (type) {
      const alpha = Math.round(this.alpha * 10)
      const beta = Math.round(this.beta * 10)
      this.record.push(type, alpha, beta)
    }
  },

  mounted () {
    this.gyro.updateOffset({ alpha: this.alpha, beta: this.beta })
    this.updateScreenSize()

    this.vuetaminState = this.$vuetamin.store.getState()

    this.$vuetamin.store.mutate('updateLazyRadius', 40 * (this.distance / 800))
    this.$vuetamin.store.mutate('updateBrushRadius', 4 * (this.distance / 800))
  },

  beforeDestroy () {
    this.clearTimeouts()

    window.cancelAnimationFrame(animationFrame)
  }
}
</script>

<style lang="scss">

.seek {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  padding: 2rem;
  input {
    width: 100%;
  }
}

.animation__debug {
  position: fixed;
  top: 20rem;
  left: 0;
  width: 30rem;
  padding: 4rem;
  z-index: 99999;
  font-size: 1rem;
  background: white;
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
$wireframe-border-color: rgb(175, 175, 175);

$animation-base: 900;
$perspective-mobile: 2;
$perspective: 1.25;
$animation-phone-distance: 1;

$phone-translate-z: var(--animation-phone-distance);

$movement-transition: 1.8s;

$screen-border-width: 0.03;

@function b($multiplier) {
  @return $multiplier * 1em;
}

@mixin sides ($depth, $border) {
  position: absolute;
  &:nth-child(1) {
    top: -$border;
    left: -$border;
    right: -$border;
    height: $depth;
    transform: rotateX(-90deg);
    transform-origin: top left;
    border-bottom-width: $border * 2;
  }
  &:nth-child(2) {
    bottom: -$border;
    left: -$border;
    right: -$border;
    height: $depth;
    transform: rotateX(90deg);
    transform-origin: bottom left;
    border-top-width: $border * 2;
  }
  &:nth-child(3) {
    top: -$border;
    left: -$border;
    bottom: -$border;
    width: $depth;
    transform: rotateY(90deg);
    transform-origin: top left;
    border-right-width: $border * 2;
  }
  &:nth-child(4) {
    top: -$border;
    right: -$border;
    bottom: -$border;
    width: $depth;
    transform: rotateY(-90deg);
    transform-origin: top right;
    border-left-width: $border * 2;
  }
}

.animation {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: white;
}

.animation__slot {
  position: relative;
  z-index: 1000;
  padding-top: 70vw;
  .is-desktop & {
    padding-top: 0;
  }
}

.animation__stage {
  position: relative;
  width: b(1);
  height: b(1);
  top: 0;
  left: 0;
  position: absolute;
  z-index: 499;
  transform-origin: top left;
  overflow: hidden;
  .is-desktop & {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  &.is-pairing {
    pointer-events: none;
  }
}

.animation__world {
  perspective: b($perspective-mobile);
  @include media('md') {
    perspective: b($perspective);
  }
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
  transform: translateZ(0em) rotateY(-0deg);
  transform-style: preserve-3d;
}

.phone {
  width: b(0.1);
  height: b(0.2);
  background: #fafafa;
  border: $wireframe-border;
  border-width: 1px;
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
  opacity: 0.2;
  transform: translateZ(b(-0.005));
  transform-origin: bottom;
}

.floor {
  width: b(2);
  height: b(6);
  background: white;
  position: absolute;
  z-index: 0;
  bottom: 0;
  left: b(-0.5);
  // background: linear-gradient(180deg, #ddd, #fff);
  background: #fafafa;
  transform: rotateX(90deg) translateZ(-2px) translateY(b(1.25));
  transform-origin: bottom;
  @include media('sm') {
    // background: linear-gradient(90deg, #f4f4f4, #fcfcfc);
  }
}

.phone__button {
  position: absolute;
  bottom: b(0.0075);
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: $wireframe-border;
  border-radius: 100%;
  width: b(0.0125);
  height: b(0.0125);
}

.phone__side {
  background: #efefef;
  border: 1px solid $wireframe-border-color;
  @include sides(b(0.009), 1px);
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
}

.phone__logo {
  background: white;
  width: 70%;
  border: 1px solid $alt-color-light;
  border-radius: 23%;
  overflow: hidden;
  img {
    width: 100%;
    margin: 0 auto;
    display: block;
    background: white;
  }
}

.screen {
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  border: 2px solid $wireframe-border-color;
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
  box-shadow: 11px -11px 8px 1px rgba(#ccc, 0.2);
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
  border: 2px solid $wireframe-border-color;
  @include sides(b(0.05), 2px);

  &:nth-child(1) {
    // background: linear-gradient(90deg,
    // #a1a5ab,
    // #c2c5cb)
  }
}

.screen__circle {
  width: b(0.1);
  height: b(0.1);
  border: 3px solid $color-red;
  border-radius: 100%;
  position: absolute;
  z-index: 999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
