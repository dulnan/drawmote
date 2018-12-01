import { clearCanvas } from '@/tools/canvas'

/**
 * A canvas action.
 */
export default class Action {
  constructor (type) {
    this.type = type
  }

  /**
   * Run the action on a canvas.
   *
   * @param {HTMLCanvasElement} canvas
   * @param {Object} size
   */
  do (canvas, size) {
    switch (this.type) {
      case 'erase':
        clearCanvas(canvas, size)
        break
    }
  }
}
