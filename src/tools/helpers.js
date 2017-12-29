function getViewportSize () {
  return {
    width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    // ratio: window.devicePixelRatio,
    ratio: 1
  }
}

function pointOutsideCircle (p, c, r) {
  const distancesqured = (p.x - c.x) * (p.x - c.x) + (p.y - c.y) * (p.y - c.y)
  return distancesqured >= r * r
}

function movePointAtAngle (point, angle, distance) {
  return {
    x: point.x + (Math.cos(angle) * distance),
    y: point.y + (Math.sin(angle) * distance)
  }
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

const doFor = (count, cb) => {
  var i = 0; while (i < count && cb(i++) !== true);
}

const randomInt = (min, max = min + (min = 0)) => (Math.random() * (max - min) + min) | 0

export { getViewportSize, pointOutsideCircle, movePointAtAngle, scaleBetween, lineDistance, getRgbaString, midPointBetween, doFor, randomInt }
