const PROPERTY = 'draw'

export default {
  install (Vue, options) {
    Vue.prototype.$test = 'haloo'

    Vue.mixin({
      mounted () {
        let events = this.$options[PROPERTY]

        if (events) {
          events.forEach(event => {
            this.$global.addHandler(event, this._uid, this)
          })
        }
      },

      beforeDestroy () {
        let events = this.$options[PROPERTY]

        if (events) {
          events.forEach(event => {
            this.$global.removeHandler(event, this._uid)
          })
        }
      }
    })
  }
}
