import PeerSox from 'peersox'

export default {
  install (Vue, { serverUrl }) {
    Vue.prototype.$peersox = new PeerSox(serverUrl, {
      debug: true,
      autoUpgrade: true
    })
  }
}
