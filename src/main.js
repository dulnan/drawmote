import 'es6-promise/auto'
import './assets/scss/main.scss'

import Vue from 'vue'
import App from './App.vue'

import * as Sentry from '@sentry/browser'

import Vuetamin from 'vuetamin'
import Track from './plugins/Track'
import Settings from './plugins/Settings'
import PeerSox from './plugins/PeerSox'

import vuetaminStore from './store/vuetamin'
import vuexStore from './store/vuex'
import i18n from './i18n'

import { getServerUrls } from '@/tools/helpers.js'
import { BREAKPOINT_REMOTE } from '@/settings'

function getGymote () {
  if (window.innerWidth > BREAKPOINT_REMOTE) {
    return import('./plugins/GymoteScreen')
  } else {
    return import('./plugins/GymoteRemote')
  }
}

if (process.env.VUE_APP_SERVER_ENV !== 'local') {
  Sentry.init({
    dsn: 'https://b0df1bd1d041480f9e8e4dd2c3b56ed5@sentry.io/1342499',
    release: `drawmote@${process.env.PKG_VERSION}`,
    environment: process.env.VUE_APP_SERVER_ENV,
    integrations: [new Sentry.Integrations.Vue({ Vue })]
  })
}

getGymote().then(({ default: Gymote }) => {
  const serverUrls = getServerUrls()
  Vue.use(Vuetamin, { store: vuetaminStore })
  Vue.use(Gymote)
  Vue.use(PeerSox, serverUrls)
  Vue.use(Track)
  Vue.use(Settings)

  Vue.config.productionTip = false

  new Vue({
    store: vuexStore,
    i18n,
    render: h => h(App)
  }).$mount('#drawmote')
})
