import PeerSox from 'peersox/lib/peersox.client'

export default {
  install (Vue, { serverUrl }) {
    Vue.prototype.$peersox = new PeerSox(serverUrl, { debug: true })
  }
}
