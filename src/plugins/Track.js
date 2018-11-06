export default {
  install (Vue) {
    Vue.prototype.$track = function (category, action, value) {
      window._paq.push(['trackEvent', category, action, value])
    }
  }
}
