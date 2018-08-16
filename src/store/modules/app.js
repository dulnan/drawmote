const namespaced = true

const state = {
  viewport: {
    width: 0,
    height: 0,
    ratio: 1
  },
  canvasRect: {
    width: 0,
    height: 0,
    top: 0,
    left: 0
  },
  toolbarRect: {
    width: 0,
    height: 0,
    top: 0,
    left: 0
  }
}

// getters
const getters = {
}

// actions
const actions = {
  checkout ({ commit, state }, products) {
  }
}

// mutations
const mutations = {
  setCanvasRect (state, { width, height, top, left }) {
    state.canvasRect = { width, height, top, left }
  },

  setToolbarRect (state, { width, height, top, left }) {
    state.toolbarRect = { width, height, top, left }
  },

  setViewport (state, { width, height, ratio }) {
    state.viewport = { width, height, ratio }
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
