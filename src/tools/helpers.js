function getViewportSize () {
  return {
    width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    ratio: window.devicePixelRatio
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

export { getViewportSize, pointOutsideCircle, movePointAtAngle, scaleBetween, lineDistance }
