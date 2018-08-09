import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import { EventBus } from './events'
import Connection from './tools/Connection'

Vue.config.productionTip = false

Vue.prototype.$connection = new Connection(EventBus)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
