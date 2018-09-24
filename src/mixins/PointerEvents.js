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

      this.$global.updateFromMouse({
        x: e.clientX,
        y: e.clientY
      })
    },

    handleMouseDown () {
      this.$global.updateIsPressing(true, {
        fromMouse: true
      })
    },

    handleMouseUp () {
      this.$global.updateIsPressing(false, {
        fromMouse: true
      })
    },

    handleTouchStart (e) {
      this.preventEventIfRequired(e)
      const touch = e.changedTouches[0]

      this.$global.updateFromMouse({
        x: touch.pageX,
        y: touch.pageY
      }, true)

      this.handleMouseDown()
    },

    handleTouchMove (e) {
      this.preventEventIfRequired(e)

      const touch = e.changedTouches[0]

      this.$global.updateFromMouse({
        x: touch.pageX,
        y: touch.pageY
      })
    },

    handleTouchEnd (e) {
      this.preventEventIfRequired(e)
      this.handleMouseUp()
    },

    preventEventIfRequired (e) {
      if (!this.$global.state.pointingAtToolbar) {
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
