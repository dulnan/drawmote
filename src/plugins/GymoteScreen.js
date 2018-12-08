import { GymoteScreen } from 'gymote'

export default {
  install (Vue) {
    Vue.prototype.$mote = new GymoteScreen()
  }
}
