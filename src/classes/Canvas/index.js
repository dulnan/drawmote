import Action from './Action'
import DrawAction from './DrawAction'
import { clearCanvas } from '@/tools/canvas'

export default class {
  /**
   * Handle drawing using { x, y } coordinates. Supports various brush
   * settings and offers undo and redo functionality.
   *
   * @param {HTMLCanvasElement} canvasMain The canvas where the drawing is.
   * @param {HTMLCanvasElement} canvasTemp Temporary canvas for the current stroke.
   */
  constructor (canvasMain, canvasTemp) {
    this.actions = []

    this._canvasMain = canvasMain
    this._canvasTemp = canvasTemp

    this._size = {
      width: 0,
      height: 0
    }

    this.currentAction = null
    this._historyIndex = 0
    this.lastActionType = ''

    this.init()
  }

  /**
   * Initialize the canvases.
   */
  init () {
    this.setSizes({ width: window.innerWidth, height: window.innerHeight })
  }

  /**
   * Returns the current state about what actions are available.
   * Used to show or hide buttons that interact with CanvasState.
   *
   * @returns {Object} Current state.
   */
  get state () {
    const undoPossible = this.actions.length > 0 && this._historyIndex > 0
    const redoPossible = this.actions.length > 0 && this._historyIndex < this.actions.length
    const clearPossible = this.lastActionType !== 'erase' || !this.lastActionType

    return { undoPossible, redoPossible, clearPossible }
  }

  /**
   * Set the sizes of the canvas.
   *
   * @param {Object} size
   * @param {Number} size.width
   * @param {Number} size.height
   */
  setSizes ({ width, height }) {
    this._size.width = width
    this._size.height = height
  }

  /**
   * Update the sizes of the canvas and redraw the current state.
   *
   * @param {Object} viewport
   */
  updateSizes (viewport) {
    this.setSizes(viewport)
    this.redraw()
  }

  /**
   * Start a new drawing action.
   *
   * @param {Object} canvasProperties
   */
  start (canvasProperties) {
    this.currentAction = new DrawAction(canvasProperties)
  }

  /**
   * If an action is being pushed while the undo functionality has been used,
   * remove all actions after that. This basically removes the ability to use
   * redo at this point, until another undo step is done.
   */
  updateHistoryState () {
    if (this._historyIndex !== this.actions.length) {
      this.actions.splice(this._historyIndex)
    }
  }

  /**
   * Push an action to the history stack und update some variables related to
   * that. Also update the history index.
   *
   * @param {DrawAction} action The action to add to the history.
   */
  pushAction (action) {
    this.updateHistoryState()
    this.actions.push(action)
    this.lastActionType = action.type
    this._historyIndex = this.actions.length
  }

  /**
   * Handles the release of the mouse or touchend.
   */
  release () {
    this.copy(this._canvasTemp, this._canvasMain)
    clearCanvas(this._canvasTemp, this._size)

    this.pushAction(this.currentAction)
  }

  /**
   * Push the point to the current action points array and then draw the current
   * action to the temporary canvas.
   *
   * @param {Point} point The x and y coordinates of the next point.
   */
  move (point) {
    this.currentAction.points.push(point)

    clearCanvas(this._canvasTemp, this._size)

    this.currentAction.do(this._canvasTemp)
  }

  /**
   * Copy the contents of the source canvas to the target canvas.
   *
   * @param {HTMLCanvasElement} source The canvas to copy from.
   * @param {HTMLCanvasElement} target The canvas to copy the source to.
   */
  copy (source, target) {
    target.getContext('2d').drawImage(source, 0, 0, this._size.width, this._size.height)
  }

  /**
   * Undo the last action.
   */
  undo () {
    clearCanvas(this._canvasMain, this._size)
    this._historyIndex = Math.max(this._historyIndex - 1, 0)

    if (this._historyIndex >= 0) {
      this.drawActions()
    }
  }

  /**
   * Redo the previous action.
   */
  redo () {
    this._historyIndex = Math.min(this._historyIndex + 1, this.actions.length)

    if (this._historyIndex <= this.actions.length) {
      clearCanvas(this._canvasMain, this._size)
      this.drawActions()
    }
  }

  /**
   * Clear the main canvas and draw all current actions.
   */
  redraw () {
    clearCanvas(this._canvasMain, this._size)
    this.drawActions()
  }

  /**
   * Draw all current actions to the main canvas.
   */
  drawActions () {
    for (let i = 0; i < this._historyIndex; i++) {
      const action = this.actions[i]
      action.do(this._canvasMain, this._size)
      this.lastActionType = action.type
    }
  }

  /**
   * Erase the contents of the main canvas and push the action for it.
   */
  erase () {
    if (this.lastActionType === 'erase') {
      return
    }

    this.pushAction(new Action('erase'))
    clearCanvas(this._canvasMain, this._size)
  }
}
