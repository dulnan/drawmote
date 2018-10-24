import { EventBus } from '@/events'

export default {
  name: 'PointerEvents',

  methods: {
    handleWheel (e) {
      e.preventDefault()

      if (e.deltaY > 0) {
        EventBus.$emit('touchUp')
      } else {
        EventBus.$emit('touchDown')
      }
    },

    handleMouseMove (e) {
      this.preventEventIfRequired(e)

      this.$loop.mutate('updatePointer', {
        coordinates: {
          x: e.clientX,
          y: e.clientY
        }
      })
    },

    handleMouseDown () {
      this.$loop.mutate('updateIsPressing', {
        isPressing: true,
        fromMouse: true
      })
    },

    handleMouseUp () {
      this.$loop.mutate('updateIsPressing', {
        isPressing: false,
        fromMouse: true
      })
    },

    handleTouchStart (e) {
      this.preventEventIfRequired(e)
      const touch = e.changedTouches[0]

      this.$loop.mutate('updatePointer', {
        both: true,
        coordinates: {
          x: touch.pageX,
          y: touch.pageY
        }
      })

      this.handleMouseDown()
    },

    handleTouchMove (e) {
      this.preventEventIfRequired(e)

      const touch = e.changedTouches[0]

      this.$loop.mutate('updatePointer', {
        coordinates: {
          x: touch.pageX,
          y: touch.pageY
        }
      })
    },

    handleTouchEnd (e) {
      this.preventEventIfRequired(e)
      this.handleMouseUp()
    },

    preventEventIfRequired (e) {
      if (!this.$loop.getState().pointingAtToolbar) {
        e.preventDefault()
      }
    }
  },

  mounted () {
    this.$el.addEventListener('wheel', this.handleWheel)

    this.$el.addEventListener('mousedown', this.handleMouseDown)
    this.$el.addEventListener('mousemove', this.handleMouseMove)
    this.$el.addEventListener('mouseup', this.handleMouseUp)

    this.$el.addEventListener('touchstart', this.handleTouchStart)
    this.$el.addEventListener('touchmove', this.handleTouchMove)
    this.$el.addEventListener('touchend', this.handleTouchEnd)
  },

  destroyed () {
    this.$el.removeEventListener('wheel', this.handleWheel)

    this.$el.removeEventListener('mousedown', this.handleMouseDown)
    this.$el.removeEventListener('mousemove', this.handleMouseMove)
    this.$el.removeEventListener('mouseup', this.handleMouseUp)

    this.$el.removeEventListener('touchstart', this.handleTouchStart)
    this.$el.removeEventListener('touchmove', this.handleTouchMove)
    this.$el.removeEventListener('touchend', this.handleTouchEnd)
  }
}
