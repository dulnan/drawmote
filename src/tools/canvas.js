/**
 * Sets the given size and scaling of the canvases.
 *
 * @param {Object} size Desired size of the canvases.
 * @param {Number} size.width Desired width.
 * @param {Number} size.height Desired height.
 * @param {HTMLCanvasElement[]} canvases Array of canvases to set the sizes.
 */
export function setupCanvases ({ width, height }, canvases) {
  const dpi = Math.min(window.devicePixelRatio, 1.5)

  canvases.forEach(canvas => {
    let context = canvas.getContext('2d')

    canvas.width = width * dpi
    canvas.height = height * dpi

    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    context.scale(dpi, dpi)
  })
}

/**
 * Clears the given canvas.
 *
 * @param {HTMLCanvasElement} canvas The context to clear.
 * @param {Object} size The area to clear.
 * @param {Number} size.width Desired width.
 * @param {Number} size.height Desired height.
 * @param {Object} coordinates The starting coordinates of the area to clear.
 * @param {Number} coordinates.x x coordinate.
 * @param {Number} coordinates.y y coordinate.
 */
export function clearCanvas (canvas, { width, height } = {}, { x = 0, y = 0 } = {}) {
  const canvasWidth = width || canvas.width
  const canvasHeight = height || canvas.height

  let context = canvas.getContext('2d')

  context.clearRect(x, y, canvasWidth, canvasHeight)
}
