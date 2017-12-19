import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import socketio from 'socket.io-client'
import VueSocketio from 'vue-socket.io'

Vue.config.productionTip = false

Vue.use(VueSocketio, socketio('http://192.168.1.113:8000'), store)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
