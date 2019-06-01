const DIMENSIONS = {
  mode: 1,
  supportsWebRTC: 2,
  supportsWebSocket: 3,
  version: 4
}

export function trackEvent(category, action, value) {
  try {
    window._paq.push(['trackEvent', category, action, value])
  } catch (e) {
    // eslint-disable-next-line
    console.log(e)
  }
}

export function trackUser(hash) {
  try {
    window._paq.push(['setUserId', hash])
  } catch (e) {
    // eslint-disable-next-line
    console.log(e)
  }
}

export function trackDimension(dimension, value) {
  try {
    window._paq.push(['setCustomDimension', DIMENSIONS[dimension], value])
  } catch (e) {
    // eslint-disable-next-line
    console.log(e)
  }
}

export default {
  install(Vue) {
    Vue.prototype.$track = trackEvent
  }
}
