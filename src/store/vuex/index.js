import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isSkipped: false,
    isConnected: false,
    introPlayed: false,
    attributionVisible: false
  },
  mutations: {
    setSkipped (state, isSkipped) {
      state.isSkipped = isSkipped
    },

    setConnected (state, isConnected) {
      state.isConnected = isConnected
    },

    setIntroPlayed (state, introPlayed) {
      state.introPlayed = introPlayed
    },

    setAttributionVisible (state, isVisible) {
      state.attributionVisible = isVisible
    }
  },

  actions: {
    connect ({ commit }) {
      commit('setSkipped', false)
      commit('setConnected', true)
    },

    disconnect ({ commit }) {
      commit('setConnected', false)
    },

    skip ({ commit }) {
      commit('setSkipped', true)
    },

    unskip ({ commit }) {
      commit('setSkipped', false)
    },

    toggleAttributionVisibility ({ state, commit }) {
      commit('setAttributionVisible', !state.attributionVisible)
    }
  }
})
