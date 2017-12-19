import * as types from '../mutation-types'

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
  state,
  getters,
  actions,
  mutations
}
