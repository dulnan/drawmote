import { GymoteScreen } from 'gymote'
import axios from 'axios'

export default {
  install (Vue, { serverUrl }) {
    Vue.prototype.$mote = new GymoteScreen(serverUrl, axios)
  }
}
