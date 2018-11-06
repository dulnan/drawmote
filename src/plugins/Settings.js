export default {
  install (Vue) {
    Vue.prototype.$settings = {
      isPrerendering: window.__PRERENDERING === true
    }
  }
}
