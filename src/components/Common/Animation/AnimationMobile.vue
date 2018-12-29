<script>
import anime from 'animejs'
import Animation from './Animation.vue'

let frames = {
  screen: {
    translateZ: {
      initial: '-1.5em',
      side: '-2.5em',
      full: '0.2em'
    },
    rotateX: {
      initial: 0,
      side: -79,
      full: -90
    },
    translateX: {
      initial: '0em',
      side: '0em',
      full: '0em'
    },
    translateY: {
      initial: '-0em',
      side: '-1.9em',
      full: '-1.7em'
    },
    rotateY: {
      initial: 0,
      side: -0,
      full: 0
    }
  },

  phone: {
    rotateX: {
      side: 90
    },
    translateZ: {
      side: 0
    }
  }
}

export default {
  name: 'AnimationMobile',

  extends: Animation,

  data () {
    return {
      scale: 0.3
    }
  },

  computed: {
    animationStyle () {
      const scale = window.innerWidth / this.windowWidth
      return {
        fontSize: this.base + 'px',
        transform: `scale(${scale})`
      }
    },

    distance () {
      return 400
    }
  },

  methods: {
    animateEnter () {
      const easing = 'easeInOutQuad'

      this.clearTimeouts()

      this.animationEnter = anime.timeline({
        autoplay: true
      })

      this.animationEnter.add({
        targets: this.$refs.slot,
        offset: 4400,
        translateY: [
          { value: '-30vw', duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: '0vw', duration: 1600, delay: 0, elasticity: 40, easing: 'easeOutQuart' }
        ],
        opacity: [
          { value: 0, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: 1, duration: 1600, delay: 0, elasticity: 7, easing: 'easeOutQuart' }
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
          { value: 1, duration: 500, delay: 0, elasticity: 7, easing: easing }
        ]
      })

      this.animationEnter.add({
        targets: this.$refs.logo,
        offset: 0,
        translateZ: [
          { value: '0.95em', duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: '0.1em', duration: 2000, delay: 0, elasticity: 7, easing: easing },
          { value: '0em', duration: 400, delay: 2600, elasticity: 100, easing: easing }
        ]
      })

      this.animationEnter.add({
        targets: this.$refs.phone,
        offset: 1200,
        rotateX: [
          { value: 0, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.phone.rotateX.side, duration: 2000, delay: 1000, elasticity: 7, easing: easing }
        ],
        translateZ: [
          { value: '2.5em', duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.phone.translateZ.side, duration: 2700, delay: 0, elasticity: 7, easing: easing }
        ],
        translateY: [
          { value: 0, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: this.distance, duration: 3000, delay: 1000, elasticity: 7, easing: easing }
        ]
      })

      this.animationEnter.add({
        targets: this.$refs.scene,
        offset: 600,
        translateZ: [
          { value: frames.screen.translateZ.initial, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateZ.side, duration: 2000, delay: 1000, elasticity: 2, easing: easing }
        ],

        rotateX: [
          { value: frames.screen.rotateX.initial, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.rotateX.side, duration: 3000, delay: 2000, elasticity: 0, easing: easing }
        ],

        translateX: [
          { value: frames.screen.translateX.initial, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateX.side, duration: 3000, delay: 500, elasticity: 0, easing: easing }
        ],

        translateY: [
          { value: frames.screen.translateY.initial, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateY.side, duration: 3000, delay: 2100, elasticity: 0, easing: easing }
        ],

        rotateY: [
          { value: frames.screen.rotateY.initial, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.screen.rotateY.side, duration: 3000, delay: 0, elasticity: 7, easing: easing }
        ]
      })

      this.animationEnter.finished.then(() => {
        this.screenAppeared = true
      })
    },

    animateLeave () {
      this.cancelAnimations()

      this.mouseEnabled = false
      this.$vuetamin.store.mutate('updateIsPressing', { isPressing: false })

      this.animationLeave = anime.timeline({
        autoplay: true
      })

      this.animationLeave.add({
        targets: this.$refs.animation,
        offset: 0,
        translateY: [
          { value: '0vh', duration: 0, delay: 0, elasticity: 40 },
          { value: '-50vh', duration: 3000, delay: 0, elasticity: 40 }
        ],
        opacity: [
          { value: 1, duration: 0, delay: 0, elasticity: 40 },
          { value: 0, duration: 3000, delay: 0, elasticity: 40 }
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
    },

    loop () {
      this.alpha = this.$mote.gyroscope.alpha - 180
      this.beta = this.$mote.gyroscope.beta - 30
      window.requestAnimationFrame(this.loop.bind(this))
    }
  },

  mounted () {
    console.log(this.$mote)
    this.$mote.updateScreenViewport({
      width: this.windowWidth,
      height: this.windowHeight
    })

    this.$mote.gyroplane.updateOffset({ alpha: this.alpha, beta: this.beta })

    this.$mote.updateScreenDistance(this.distance)

    this.loop()
  }
}
</script>

<style lang="scss">
</style>
