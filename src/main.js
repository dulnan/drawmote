import Vue from 'vue'
import App from './App.vue'
import { getCookie } from '@/tools/helpers'
import { EventBus } from './events'
import Connection from './tools/Connection'
import DataHandler from './tools/DataHandler'

import './assets/scss/main.scss'

import VueLoop from './plugins/VueLoop'
import i18n from './i18n'

Vue.use(VueLoop)

Vue.config.productionTip = false

Vue.prototype.$global = new DataHandler()
Vue.prototype.$connection = new Connection(EventBus, Vue.$global)
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
