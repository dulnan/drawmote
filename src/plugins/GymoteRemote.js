import { GymoteRemote } from 'gymote'
import axios from 'axios'

export default {
  install (Vue, { serverUrl }) {
    Vue.prototype.$mote = new GymoteRemote(serverUrl, axios)
  }
}
