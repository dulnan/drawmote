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

function scaleBetween (number, numberRange, outputRange) {
  const scaled = (number - numberRange[0]) * (outputRange[1] - outputRange[0]) / (numberRange[1] - numberRange[0]) + outputRange[0]
  return Math.min(Math.max(scaled, outputRange[0]), outputRange[1])
}

export { getViewportSize, pointOutsideCircle, movePointAtAngle, scaleBetween }
