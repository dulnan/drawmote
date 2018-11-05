import { setCookie } from '@/tools/helpers'

export default {
  storeStateCookie: function ({ data }, { noTimeout } = {}) {
    const timeout = noTimeout ? 0 : 5000

    window.clearTimeout(data.cookieTimout)
    data.cookieTimout = window.setTimeout(() => {
      setCookie('state', JSON.stringify({
        brush: data.brush.state
      }))
    }, timeout)
  }
}
