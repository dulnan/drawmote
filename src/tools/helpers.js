function getViewportSize () {
  return {
    width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    // ratio: window.devicePixelRatio,
    ratio: 1
  }
}

function midPointBetween (p1, p2) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2
  }
}

function getRgbaString (rgb, alpha) {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`
}

function shadeRgbColor (rgb, percent) {
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

function buildDataString (alpha, beta, isPressingMain, touchDiffY) {
  const values = [
    alpha,
    beta,
    isPressingMain ? 1 : 0,
    touchDiffY
  ]
  return values.join(';')
}

function parseDataString (data) {
  const arr = data.split(';')
  const alpha = Math.round(((parseFloat(arr[0]) + 180) % 360) * 100) / 100
  const beta = Math.round(parseFloat(arr[1]) * 100) / 100
  return {
    alpha: alpha,
    beta: beta,
    isPressingMain: arr[2] === '1',
    touchDiffY: parseInt(arr[3]) || 0
  }
}

function setCookie (name, value, days) {
  var expires = ''

  if (days) {
    var date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}

function getCookie (name) {
  var nameEQ = name + '='
  var ca = document.cookie.split(';')

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

function eraseCookie (name) {
  document.cookie = name + '=; Max-Age=-99999999;'
}

function isSamePoint (p1, p2) {
  return p1.x === p2.x && p1.y === p2.y
}

function buildDevServerUrl (hostname, port) {
  return `http://${hostname}:${port}`
}

export {
  setCookie,
  getCookie,
  eraseCookie,
  getViewportSize,
  getRgbaString,
  shadeRgbColor,
  midPointBetween,
  buildDataString,
  parseDataString,
  isSamePoint,
  buildDevServerUrl
}
