import { GymoteRemote } from 'gymote'

export default {
  install(Vue) {
    Vue.prototype.$mote = new GymoteRemote()
  }
}
