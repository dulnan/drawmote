import 'whatwg-fetch'
import PeerSox from 'peersox'

export default {
  install (Vue, { api, wss }) {
    Vue.prototype.$peersox = new PeerSox(api, {
      debug: process.env.VUE_APP_SERVER_ENV !== 'production',
      autoUpgrade: true,
      socketServerUrl: wss
    })
  }
}
