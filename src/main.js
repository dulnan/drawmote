import 'es6-promise/auto'
import './assets/scss/main.scss'

import Vue from 'vue'
import App from './App.vue'

import Vuetamin from 'vuetamin'
import Connection from './plugins/Connection'
import Track from './plugins/Track'
import Settings from './plugins/Settings'

import store from './store'
import i18n from './i18n'

Vue.use(Vuetamin, { store })
Vue.use(Connection)
Vue.use(Track)
Vue.use(Settings)

Vue.config.productionTip = false

new Vue({
  i18n,
  render: h => h(App)
}).$mount('#drawmote')
