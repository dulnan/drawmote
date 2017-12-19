function getPointOnScreen (alpha, beta, width, height) {
  let x = Math.round((width / 2) + (14 * alpha))
  let y = Math.round((height / 2) - (14 * beta))
  return {
    x: x,
    y: y
  }
}

export { getPointOnScreen }
