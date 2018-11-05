import { clearCanvas } from '@/tools/canvas'

/**
 * A canvas action.
 */
export default class Action {
  constructor (type) {
    this.type = type
  }

  do (canvas, size) {
    switch (this.type) {
      case 'erase':
        clearCanvas(canvas, size)
        break
    }
  }
}
