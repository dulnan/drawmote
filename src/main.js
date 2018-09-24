import Vue from 'vue'

import App from './App.vue'

import { EventBus } from './events'
import Connection from './tools/Connection'
import DataHandler from './tools/DataHandler'

import './assets/scss/main.scss'

import VueLoop from './plugins/VueLoop'
import i18n from './i18n'

Vue.use(VueLoop)

Vue.config.productionTip = false

const global = new DataHandler()
window.global = global
Vue.prototype.$global = global
Vue.prototype.$connection = new Connection(EventBus, global)

Vue.prototype.$track = function (category, action, value) {
  window._paq.push(['trackEvent', category, action, value])
}

new Vue({
  i18n,
  render: h => h(App)
}).$mount('#drawmote')
