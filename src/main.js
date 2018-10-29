import Vue from 'vue'
import App from './App.vue'
import { getCookie } from '@/tools/helpers'

import './assets/scss/main.scss'

import Vuetamin from 'vue-tamin'
import Connection from './tools/Connection'

import { store } from './store'
import i18n from './i18n'

Vue.use(Vuetamin, { store })
Vue.use(Connection)

Vue.config.productionTip = false

Vue.prototype.$track = function (category, action, value) {
  window._paq.push(['trackEvent', category, action, value])
}

const locale = getCookie('locale')
if (locale) {
  i18n.locale = locale
}

new Vue({
  i18n,
  render: h => h(App)
}).$mount('#drawmote')
