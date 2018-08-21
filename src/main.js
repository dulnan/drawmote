import Vue from 'vue'
import App from './App'
import router from './router'

import { EventBus } from './events'
import Connection from './tools/Connection'
import DataHandler from './tools/DataHandler'

import VueLoop from './plugins/VueLoop'

Vue.use(VueLoop)

Vue.config.productionTip = false

const global = new DataHandler()
window.global = global
Vue.prototype.$global = global
Vue.prototype.$connection = new Connection(EventBus, global)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
