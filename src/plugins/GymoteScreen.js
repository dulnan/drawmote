import { GymoteScreen } from 'gymote/lib/gymote.js'

export default {
  install (Vue) {
    Vue.prototype.$mote = new GymoteScreen()
  }
}
