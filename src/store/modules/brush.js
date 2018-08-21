import { DEFAULT_COLOR, RADIUS_DEFAULT, HARDNESS_DEFAULT, OPACITY_DEFAULT } from '@/settings'

const namespaced = true

const state = {
  color: DEFAULT_COLOR,
  radius: RADIUS_DEFAULT,
  hardness: HARDNESS_DEFAULT,
  opacity: OPACITY_DEFAULT,
  style: 'smudge',
  isPressing: false,
  useLazyBrush: true,
  lazyRadius: RADIUS_DEFAULT
}

// getters
const getters = {
  lazyRadius (state) {
    return state.radius * 6
  }
}

// actions
const actions = {
  checkout ({ commit, state }, products) {
  }
}

// mutations
const mutations = {
  setColor (state, color) {
    state.color = color
  },

  setRadius (state, radius) {
    state.radius = radius
  },

  setHardness (state, hardness) {
    state.hardness = hardness
  },

  setOpacity (state, opacity) {
    state.opacity = opacity
  },

  setIsPressing (state, isPressing) {
    state.isPressing = isPressing
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
