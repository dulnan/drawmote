export function getViewportSize () {
  return {
    width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    // ratio: window.devicePixelRatio,
    ratio: 1
  }
}

export function midPointBetween (p1, p2) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2
  }
}

export function getRgbaString (rgb, alpha) {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`
}

/**
 * Convert a hex color string to rgb values.
 *
 * @param {String} hex The hex string to convert.
 * @returns {Array} The converted rgb values as an array.
 */
export function hexToRgb (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null
}

export function shadeRgbColor (rgb, percent) {
  let f = rgb
  let t = percent < 0 ? 0 : 255
  let p = percent < 0 ? percent * -1 : percent
  let R = parseInt(f[0])
  let G = parseInt(f[1])
  let B = parseInt(f[2])

  return [
    (Math.round((t - R) * p) + R),
    (Math.round((t - G) * p) + G),
    (Math.round((t - B) * p) + B)
  ]
}

export function setCookie (name, value, days) {
  var expires = ''

  if (days) {
    var date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}

export function getCookie (name) {
  var nameEQ = name + '='
  var ca = document.cookie.split(';')

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export function eraseCookie (name) {
  document.cookie = name + '=; Max-Age=-99999999;'
}

export function isSamePoint (p1, p2) {
  return p1.x === p2.x && p1.y === p2.y
}

export function buildDevServerUrl (hostname, port) {
  return `http://${hostname}:${port}`
}

export function getServerUrl () {
  if (process.env.VUE_APP_API_URL) {
    return process.env.VUE_APP_API_URL
  } else {
    return buildDevServerUrl(window.location.hostname, '3000')
  }
}
