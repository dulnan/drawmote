import * as types from '../mutation-types'

const namespaced = true

// initial state
// shape: [{ id, quantity }]
const state = {
  added: [],
  checkoutStatus: null
}

// getters
const getters = {
  checkoutStatus: state => state.checkoutStatus
}

// actions
const actions = {
  checkout ({ commit, state }, products) {
  }
}

// mutations
const mutations = {
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
