import 'es6-promise/auto'
import './assets/scss/main.scss'

import Vue from 'vue'
import App from './App.vue'

import Vuetamin from 'vuetamin'
import VueResize from 'vue-resize'
import Track from './plugins/Track'
import Settings from './plugins/Settings'
import PeerSox from './plugins/PeerSox'
import Sentry from './plugins/Sentry'

import vuetaminStore from './store/vuetamin'
import vuexStore from './store/vuex'
import i18n from './i18n'

import { getServerUrls } from '@/tools/helpers.js'
import { BREAKPOINT_REMOTE } from '@/settings'

function getGymote() {
  if (window.innerWidth > BREAKPOINT_REMOTE) {
    return import('./plugins/GymoteScreen')
  } else {
    return import('./plugins/GymoteRemote')
  }
}

Vue.use(Sentry)

getGymote().then(({ default: Gymote }) => {
  const serverUrls = getServerUrls()
  Vue.use(Vuetamin, { store: vuetaminStore })
  Vue.use(Gymote)
  Vue.use(PeerSox, serverUrls)
  Vue.use(Track)
  Vue.use(Settings)
  Vue.use(VueResize)

  Vue.config.productionTip = false

  new Vue({
    store: vuexStore,
    i18n,
    render: h => h(App)
  }).$mount('#drawmote')
})
