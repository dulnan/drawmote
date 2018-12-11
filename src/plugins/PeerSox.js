import PeerSox from 'peersox'

export default {
  install (Vue, { api, wss }) {
    Vue.prototype.$peersox = new PeerSox(api, {
      debug: true,
      autoUpgrade: true,
      socketServerUrl: wss
    })
  }
}
