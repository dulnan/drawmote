<script>
import anime from 'animejs'
import Animation from './Animation.vue'
import debouncedResize from 'debounced-resize'

let frames = {
  slot: {
    opacity: {
      initial: 0,
      side: 1,
      full: 0
    },
    translateX: {
      initial: '-17vw',
      side: '0vw',
      full: 0
    }
  },
  laser: {
    scaleY: {
      initial: 0,
      side: 1,
      full: null
    }
  },
  circle: {
    translateX: {
      initial: '-50%',
      side: '-50%',
      full: '-50%'
    },
    translateY: {
      initial: '-50%',
      side: '-50%',
      full: '-50%'
    },
    opacity: {
      initial: 1,
      side: 0,
      full: 0
    },
    scale: {
      initial: 0,
      side: 3,
      full: 3
    }
  },
  logoImage: {
    opacity: {
      initial: 0,
      side: 1,
      full: 1
    }
  },
  logo: {
    translateZ: {
      initial: ['0.2em', '0.1em'],
      side: '0em',
      full: ''
    }
  },

  phone: {
    rotateX: {
      initial: 90,
      side: 90,
      full: null
    },
    rotateZ: {
      initial: 0,
      side: 0,
      full: null
    },
    translateZ: {
      initial: '-0.499em',
      side: '0em',
      full: null
    },
    translateY: {
      initial: distance => distance * 0.105,
      side: distance => distance,
      full: distance => distance
    }
  },

  screen: {
    translateZ: {
      initial: '1.4em',
      side: {
        sm: '-1.4em',
        md: '-1.3em',
        lg: '-1.3em'
      },
      full: '0em'
    },
    rotateX: {
      initial: -90,
      side: {
        sm: -19,
        md: -24,
        lg: -24
      },
      full: 0
    },
    translateX: {
      initial: '0em',
      side: {
        sm: '0.55em',
        md: '0.45em',
        lg: '0.45em'
      },
      full: '0em'
    },
    translateY: {
      initial: '-0em',
      side: {
        sm: '0em',
        md: '-0.1em',
        lg: '-0.1em'
      },
      full: '0em'
    },
    rotateY: {
      initial: 45,
      side: {
        sm: -38,
        md: -41,
        lg: -41
      },
      full: 0
    },
    rotateZ: {
      initial: 0,
      side: {
        sm: -1.9,
        md: -1.2,
        lg: -1.2
      },
      full: 0
    }
  }
}

export default {
  name: 'AnimationDesktop',

  extends: Animation,

  data () {
    return {
      viewport: 'sm'
    }
  },

  computed: {
    animationStyle () {
      return {
        fontSize: this.base + 'px',
        transform: 'translate(-50%,-50%)'
      }
    }
  },

  methods: {
    animateEnter () {
      const easing = 'easeInOutQuad'

      this.clearTimeouts()

      this.animationEnter = anime.timeline({
        autoplay: true,
        begin: () => {
          this.isRendered = true
        }
      })

      this.animationEnter.add({
        targets: this.$el,
        offset: 0,
        opacity: [
          { value: 0, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: 1, duration: 200, delay: 0, elasticity: 7, easing: easing }
        ]
      })

      this.animationEnter.add({
        targets: this.$refs.slot,
        offset: 4300,
        opacity: [
          { value: frames.slot.opacity.initial, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.slot.opacity.side, duration: 2000, delay: 0, elasticity: 7, easing: easing }
        ],
        translateX: [
          { value: frames.slot.translateX.initial, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.slot.translateX.side, duration: 2000, delay: 0, elasticity: 7, easing: easing }
        ]
      })

      this.animationEnter.add({
        targets: this.$refs.laser,
        offset: 5000,
        scaleY: [
          { value: frames.laser.scaleY.initial, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.laser.scaleY.side, duration: 400, delay: 0, elasticity: 7, easing: easing }
        ]
      })

      this.animationEnter.add({
        targets: this.$refs.circle,
        offset: 5000,
        translateX: [
          { value: frames.circle.translateX.initial, duration: 0, delay: 0, elasticity: 7, easing: easing }
        ],
        translateY: [
          { value: frames.circle.translateY.initial, duration: 0, delay: 0, elasticity: 7, easing: easing }
        ],
        opacity: [
          { value: frames.circle.opacity.initial, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.circle.opacity.side, duration: 900, delay: 0, elasticity: 7, easing: easing }
        ],
        scale: [
          { value: frames.circle.scale.initial, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.circle.scale.side, duration: 1100, delay: 0, elasticity: 70, easing: easing }
        ]
      })

      this.animationEnter.add({
        targets: this.$refs.logoImage,
        offset: 0,
        opacity: [
          { value: frames.logoImage.opacity.initial, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.logoImage.opacity.side, duration: 800, delay: 0, elasticity: 100, easing: easing }
        ]
      })

      this.animationEnter.add({
        targets: this.$refs.logo,
        offset: 0,
        translateZ: [
          { value: frames.logo.translateZ.initial[0], duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.logo.translateZ.initial[1], duration: 4000, delay: 0, elasticity: 7, easing: easing },
          { value: frames.logo.translateZ.side, duration: 800, delay: 300, elasticity: 100, easing: easing }
        ]
      })

      this.animationEnter.add({
        targets: this.$refs.phone,
        offset: 600,

        rotateX: [
          { value: frames.phone.rotateX.initial, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.phone.rotateX.side, duration: 2000, delay: 1500, elasticity: 7, easing: easing }
        ],
        rotateZ: [
          { value: frames.phone.rotateZ.initial, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.phone.rotateZ.side, duration: 2000, delay: 1500, elasticity: 7, easing: easing }
        ],
        translateZ: [
          { value: frames.phone.translateZ.initial, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.phone.translateZ.side, duration: 2000, delay: 1000, elasticity: 7, easing: easing }
        ],
        translateY: [
          { value: frames.phone.translateY.initial(this.distance), duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.phone.translateY.side(this.distance), duration: 3000, delay: 2500, elasticity: 7, easing: easing }
        ]
      })

      this.animationEnter.add({
        targets: this.$refs.scene,
        offset: 400,
        translateZ: [
          { value: frames.screen.translateZ.initial, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateZ.side[this.viewport], duration: 5000, delay: 0, elasticity: 2, easing: easing }
        ],

        rotateX: [
          { value: frames.screen.rotateX.initial, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.rotateX.side[this.viewport], duration: 4000, delay: 2000, elasticity: 0, easing: easing }
        ],

        translateX: [
          { value: frames.screen.translateX.initial, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateX.side[this.viewport], duration: 3000, delay: 2500, elasticity: 0, easing: easing }
        ],

        translateY: [
          { value: frames.screen.translateY.initial, duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateY.side[this.viewport], duration: 4000, delay: 2000, elasticity: 0, easing: easing }
        ],
        rotateY: [
          { value: frames.screen.rotateY.initial, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.screen.rotateY.side[this.viewport], duration: 4000, delay: 2000, elasticity: 7, easing: easing }
        ],
        rotateZ: [
          { value: frames.screen.rotateZ.initial, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.screen.rotateZ.side[this.viewport], duration: 4000, delay: 2000, elasticity: 7, easing: easing }
        ]
      })
    },

    animateLeave (reverse) {
      this.cancelAnimations()
      this.$vuetamin.store.mutate('updateIsPressing', { isPressing: false })

      const easing = 'easeInOutQuad'

      const startTranslateZ = this.distance + 'px'
      const startRotateX = -this.beta + 90
      const startRotateZ = 180 - this.alpha

      this.animationLeave = anime.timeline({
        autoplay: true,
        direction: reverse ? 'reverse' : 'normal',
        begin: () => {
          this.isRendered = true
        }
      })

      this.animationLeave.add({
        targets: this.$el,
        offset: 3500,
        opacity: [
          { value: 1, duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: 0, duration: 500, delay: 0, elasticity: 7, easing: easing }
        ]
      })

      this.animationLeave.add({
        targets: this.$refs.circle,
        offset: 0,
        opacity: [
          { value: 0, duration: 0, delay: 0, elasticity: 2, easing: easing }
        ]
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
          { value: frames.screen.translateZ.side[this.viewport], duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateZ.full, duration: 2000, delay: 1000, elasticity: 2, easing: easing }
        ],

        rotateX: [
          { value: frames.screen.rotateX.side[this.viewport], duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.rotateX.full, duration: 2000, delay: 1000, elasticity: 0, easing: easing }
        ],

        translateX: [
          { value: frames.screen.translateX.side[this.viewport], duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateX.full, duration: 2000, delay: 0, elasticity: 0, easing: easing }
        ],

        translateY: [
          { value: frames.screen.translateY.side[this.viewport], duration: 0, delay: 0, elasticity: 0 },
          { value: frames.screen.translateY.full, duration: 2000, delay: 1000, elasticity: 0, easing: easing }
        ],

        rotateY: [
          { value: frames.screen.rotateY.side[this.viewport], duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.screen.rotateY.full, duration: 3000, delay: 0, elasticity: 7, easing: easing }
        ],

        rotateZ: [
          { value: frames.screen.rotateZ.side[this.viewport], duration: 0, delay: 0, elasticity: 7, easing: easing },
          { value: frames.screen.rotateZ.full, duration: 3000, delay: 0, elasticity: 7, easing: easing }
        ]
      })

      // this.animationLeave.play()
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
      // e.preventDefault()
      this.$vuetamin.store.mutate('updateIsPressing', { isPressing: true })
    },

    onMouseUp (e) {
      if (!this.mouseEnabled) {
        return
      }
      // e.preventDefault()
      this.$vuetamin.store.mutate('updateIsPressing', { isPressing: false })
    }
  },

  created () {
    if (window.innerWidth > 1680) {
      this.viewport = 'xl'
    } else if (window.innerWidth > 1441) {
      this.viewport = 'lg'
    } else if (window.innerWidth > 1024) {
      this.viewport = 'md'
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
