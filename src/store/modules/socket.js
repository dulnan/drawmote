import * as types from '../mutation-types'

const namespaced = true

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
  createSession ({ commit, state }) {
    this.$socket.emit('createSession')
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
  namespaced,
  state,
  getters,
  actions,
  mutations
}
