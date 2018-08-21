function getViewportSize () {
  return {
    width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    // ratio: window.devicePixelRatio,
    ratio: 1
  }
}

function pointIsInRectangle (p, r) {
  return r.x1 <= p.x && p.x <= r.x2 && r.y1 <= p.y && p.y <= r.y2
}

function lineDistance (x1, y1, x2, y2) {
  // calculate euclidean distance between (x1, y1) and (x2, y2)
  const xs = Math.pow(x2 - x1, 2)
  const ys = Math.pow(y2 - y1, 2)
  return Math.sqrt(xs + ys)
}

function scaleBetween (number, numberRange, outputRange) {
  const scaled = (number - numberRange[0]) * (outputRange[1] - outputRange[0]) / (numberRange[1] - numberRange[0]) + outputRange[0]
  return Math.min(Math.max(scaled, outputRange[0]), outputRange[1])
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

const doFor = (count, cb) => {
  var i = 0; while (i < count && cb(i++) !== true);
}

const randomInt = (min, max = min + (min = 0)) => (Math.random() * (max - min) + min) | 0

function buildDataString (orientation, isPressingMain, touchDiffY) {
  const values = [
    orientation.alpha,
    orientation.beta,
    isPressingMain ? 1 : 0,
    touchDiffY
  ]
  return values.join(';')
}

function parseDataString (data) {
  const arr = data.split(';')
  return {
    alpha: arr[0],
    beta: arr[1],
    isPressingMain: arr[2] === '1',
    touchDiffY: parseInt(arr[3]) || 0
  }
}

function getAreaFromDomRect (rect) {
  return {
    x1: Math.round(rect.left),
    y1: Math.round(rect.top),
    x2: Math.round(rect.left + rect.width),
    y2: Math.round(rect.top + rect.height)
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

export {
  setCookie,
  getCookie,
  eraseCookie,
  getViewportSize,
  pointIsInRectangle,
  scaleBetween,
  lineDistance,
  getRgbaString,
  shadeRgbColor,
  midPointBetween,
  doFor,
  randomInt,
  buildDataString,
  parseDataString,
  getAreaFromDomRect,
  isSamePoint
}
