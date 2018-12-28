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
      side: -24,
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
      side: -41,
      full: 0
    },
    rotateZ: {
      initial: 0,
      side: -1.2,
      full: 0
    }
  }
}

export default {
  name: 'AnimationDesktop',

  extends: Animation,

  data () {
    return {
      isDesktop: true
    }
  },

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
        targets: this.$refs.slot,
        offset: 4300,
        opacity: [
          { value: 0, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: 1, duration: 2000, delay: 0, elasticity: 7, easing: easing }
        ],
        translateX: [
          { value: '-17vw', duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: '0vw', duration: 2000, delay: 0, elasticity: 7, easing: easing }
        ]
      })

      this.animationEnter.add({
        targets: this.$refs.laser,
        offset: 5000,
        scaleY: [
          { value: 0, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: 1, duration: 400, delay: 0, elasticity: 7, easing: easing }
        ]
      })

      this.animationEnter.add({
        targets: this.$refs.circle,
        offset: 5190,
        translateX: [
          { value: '-50%', duration: 0, delay: 0, elasticity: 7, easing: easing }
        ],
        translateY: [
          { value: '-50%', duration: 0, delay: 0, elasticity: 7, easing: easing }
        ],
        opacity: [
          { value: 1, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: 0, duration: 1000, delay: 0, elasticity: 7, easing: easing }
        ],
        scale: [
          { value: 0, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: 2.5, duration: 1000, delay: 0, elasticity: 7, easing: easing }
        ]
      })

      this.animationEnter.add({
        targets: this.$refs.logoImage,
        offset: 0,
        opacity: [
          { value: 0, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: 1, duration: 800, delay: 0, elasticity: 100, easing: easing }
        ]
      })

      this.animationEnter.add({
        targets: this.$refs.logo,
        offset: 0,
        translateZ: [
          { value: '0.2em', duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: '0.1em', duration: 4000, delay: 0, elasticity: 7, easing: easing },
          { value: '0em', duration: 800, delay: 300, elasticity: 100, easing: easing }
        ]
      })

      this.animationEnter.add({
        targets: this.$refs.phone,
        offset: 600,

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
        offset: 400,
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
        ],
        rotateZ: [
          { value: frames.screen.rotateZ.initial, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.screen.rotateZ.side, duration: 4000, delay: 2000, elasticity: 7, easing: easing }
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

      this.animationLeave = anime.timeline({
        autoplay: true
      })

      this.animationLeave.add({
        targets: this.$refs.slot,
        offset: 0,
        opacity: [
          { value: 1, duration: 0, delay: 0, elasticity: 0 },
          { value: 0, duration: 1500, delay: 0, elasticity: 2, easing: easing }
        ],
        translateX: [
          { value: '0vw', duration: 0, delay: 0, elasticity: 0 },
          { value: '-20vw', duration: 1500, delay: 0, elasticity: 2, easing: easing }
        ]
      })

      this.animationLeave.add({
        targets: this.$refs.laser,
        offset: 1000,
        scaleY: [
          { value: 1, duration: 0, delay: 0, elasticity: 0 },
          { value: 0, duration: 400, delay: 0, elasticity: 2, easing: easing }
        ]
      })

      this.animationLeave.add({
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

      this.animationLeave.add({
        targets: this.$refs.scene,
        offset: 0,
        translateZ: [
          { value: frames.screen.translateZ.side, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateZ.full, duration: 2000, delay: 1000, elasticity: 2, easing: easing }
        ],

        rotateX: [
          { value: frames.screen.rotateX.side, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.rotateX.full, duration: 2000, delay: 1000, elasticity: 0, easing: easing }
        ],

        translateX: [
          { value: frames.screen.translateX.side, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateX.full, duration: 2000, delay: 0, elasticity: 0, easing: easing }
        ],

        translateY: [
          { value: frames.screen.translateY.side, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateY.full, duration: 2000, delay: 1000, elasticity: 0, easing: easing }
        ],

        rotateY: [
          { value: frames.screen.rotateY.side, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.screen.rotateY.full, duration: 3000, delay: 0, elasticity: 7, easing: easing }
        ],

        rotateZ: [
          { value: frames.screen.rotateZ.side, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.screen.rotateZ.full, duration: 3000, delay: 0, elasticity: 7, easing: easing }
        ]
      })

      this.animationLeave.add({
        targets: this.$el,
        offset: 3000,
        opacity: [
          { value: 1, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: 0, duration: 1000, delay: 0, elasticity: 7, easing: easing }
        ]
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

  beforeMount () {
    this.updateSizes()
  },

  mounted () {
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
