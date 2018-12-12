import { setCookie } from '@/tools/helpers'

export function storeStateCookie ({ data }, { noTimeout } = {}) {
  const timeout = noTimeout ? 0 : 5000

  window.clearTimeout(data.cookieTimout)
  data.cookieTimout = window.setTimeout(() => {
    setCookie('state', JSON.stringify({
      brush: data.brush.state,
      lazyRadius: data.lazyBrush.getRadius(),
      gymoteDistance: data.gymoteDistance
    }))
  }, timeout)
}
