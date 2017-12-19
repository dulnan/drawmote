import * as types from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
const state = {
  token: [],
  connected: false
}

// getters
const getters = {
  isConnected: state => state.connected
}

// actions
const actions = {
  getPairingToken ({ commit, state }) {
    this.$socket.emit('getPairingToken')
  }
}

// mutations
const mutations = {
  SOCKET_CONNECT (state) {
    state.connected = true
  },
  [types.ADD_TO_CART] (state, { id }) {
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
