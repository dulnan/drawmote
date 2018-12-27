<script>
import anime from 'animejs'
import Animation from './Animation.vue'
import debouncedResize from 'debounced-resize'

let frames = {
  screen: {
    translateZ: {
      initial: '1.4em',
      side: '-1.3em',
      full: '0em'
    },
    rotateX: {
      initial: -90,
      side: -30,
      full: 0
    },
    translateX: {
      initial: '0em',
      side: '0.45em',
      full: '0em'
    },
    translateY: {
      initial: '-0em',
      side: '-0.1em',
      full: '0em'
    },
    rotateY: {
      initial: 45,
      side: -45,
      full: 0
    }
  }
}

export default {
  name: 'AnimationDesktop',

  extends: Animation,

  computed: {
    animationStyle () {
      return {
        fontSize: this.base + 'px'
      }
    }
  },

  methods: {
    animateEnter () {
      const easing = 'easeInOutQuad'

      this.clearTimeouts()

      this.timeouts.push(window.setTimeout(() => {
        this.screenAppeared = true
        this.loop()
      }, 7000))

      this.animationEnter = anime.timeline({
        autoplay: true
      })

      this.animationEnter.add({
        targets: this.$refs.laser,
        offset: 5000,
        scaleY: [
          { value: 0, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: 1, duration: 400, delay: 400, elasticity: 7, easing: easing }
        ]
      })

      this.animationEnter.add({
        targets: this.$refs.logo,
        offset: 5000,
        translateZ: [
          { value: '0.1em', duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: '0em', duration: 400, delay: 0, elasticity: 100, easing: easing }
        ]
      })

      this.animationEnter.add({
        targets: this.$refs.phone,
        offset: 1500,

        rotateX: [
          { value: 90, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: 90, duration: 2000, delay: 1500, elasticity: 7, easing: easing }
        ],
        rotateZ: [
          { value: 0, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: 0, duration: 2000, delay: 1500, elasticity: 7, easing: easing }
        ],
        translateZ: [
          { value: '-0.499em', duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: 0, duration: 2000, delay: 1000, elasticity: 7, easing: easing }
        ],
        translateY: [
          { value: this.distance * 0.105, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: this.distance, duration: 3000, delay: 2500, elasticity: 7, easing: easing }
        ]
      })

      this.animationEnter.add({
        targets: this.$refs.scene,
        offset: 1000,
        translateZ: [
          { value: frames.screen.translateZ.initial, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateZ.side, duration: 5000, delay: 0, elasticity: 2, easing: easing }
        ],

        rotateX: [
          { value: frames.screen.rotateX.initial, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.rotateX.side, duration: 4000, delay: 2000, elasticity: 0, easing: easing }
        ],

        translateX: [
          { value: frames.screen.translateX.initial, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateX.side, duration: 3000, delay: 2500, elasticity: 0, easing: easing }
        ],

        translateY: [
          { value: frames.screen.translateY.initial, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateY.side, duration: 4000, delay: 2000, elasticity: 0, easing: easing }
        ],
        rotateY: [
          { value: frames.screen.rotateY.initial, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.screen.rotateY.side, duration: 4000, delay: 2000, elasticity: 7, easing: easing }
        ]
      })
    },

    animateLeave () {
      this.cancelAnimations()
      this.mouseEnabled = false
      this.$vuetamin.store.mutate('updateIsPressing', { isPressing: false })

      const easing = 'easeInOutQuad'

      const startTranslateZ = this.distance + 'px'
      const startRotateX = -this.beta + 90
      const startRotateZ = 180 - this.alpha

      this.animationFullscreen = anime.timeline({
        autoplay: true
      })

      this.animationFullscreen.add({
        targets: this.$refs.laser,
        offset: 1000,
        scaleY: [
          { value: 1, duration: 0, delay: 0, elasticity: 0 },
          { value: 0, duration: 1000, delay: 0, elasticity: 2, easing: easing }
        ]
      })

      this.animationFullscreen.add({
        targets: this.$refs.phone,
        offset: 1000,
        translateZ: [
          { value: startTranslateZ, duration: 0, delay: 0, elasticity: 0 },
          { value: this.distance * 4.3, duration: 2000, delay: 0, elasticity: 2, easing: easing }
        ],

        rotateX: [
          { value: startRotateX, duration: 0, delay: 0, elasticity: 0 },
          { value: 90, duration: 2000, delay: 0, elasticity: 50, easing: easing }
        ],

        rotateZ: [
          { value: startRotateZ, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: 0, duration: 2000, delay: 0, elasticity: 7, easing: easing }
        ]
      })

      this.animationFullscreen.add({
        targets: this.$refs.scene,
        offset: 0,
        translateZ: [
          { value: frames.screen.translateZ.side, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateZ.full, duration: 3000, delay: 2000, elasticity: 2, easing: easing }
        ],

        rotateX: [
          { value: frames.screen.rotateX.side, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.rotateX.full, duration: 2000, delay: 1000, elasticity: 0, easing: easing }
        ],

        translateX: [
          { value: frames.screen.translateX.side, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateX.full, duration: 3000, delay: 0, elasticity: 0, easing: easing }
        ],

        translateY: [
          { value: frames.screen.translateY.side, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateY.full, duration: 2000, delay: 1000, elasticity: 0, easing: easing }
        ],

        rotateY: [
          { value: frames.screen.rotateY.side, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.screen.rotateY.full, duration: 4000, delay: 0, elasticity: 7, easing: easing }
        ]
      })

      this.animationFullscreen.finished.then(() => {
        this.sceneVisible = false
      })
    },

    onMouseMove (e) {
      if (!this.mouseEnabled) {
        return
      }
      // e.preventDefault()
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
    }
  },

  mounted () {
    this.updateSizes()
    debouncedResize((e) => {
      this.updateSizes()
    })

    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mousedown', this.onMouseDown)
    window.addEventListener('mouseup', this.onMouseUp)
  },

  beforeDestroy () {
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('mousedown', this.onMouseDown)
    window.removeEventListener('mouseup', this.onMouseUp)
  }
}
</script>

<style lang="scss">
</style>
