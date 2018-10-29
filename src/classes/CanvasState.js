import { midPointBetween } from '@/tools/helpers.js'

export default class CanvasState {
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

  get state () {
    const undoPossible = this.actions.length > 0 && this._historyIndex > 0
    const redoPossible = this.actions.length > 0 && this._historyIndex < this.actions.length
    const clearPossible = this.lastActionType !== 'erase' || !this.lastActionType

    return { undoPossible, redoPossible, clearPossible }
  }

  init () {
    this.setSizes({ width: window.innerWidth, height: window.innerHeight })
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

  updateHistoryState () {
    if (this._historyIndex !== this.actions.length) {
      this.actions.splice(this._historyIndex)
    }
  }

  pushAction (action) {
    this.updateHistoryState()
    this.actions.push(action)
    this.lastActionType = action.type
    this._historyIndex = this.actions.length
  }

  release () {
    this.copy(this._canvasTemp, this._canvasMain)
    this.clear(this._canvasTemp)

    this.pushAction(this.currentAction)
  }

  move (point) {
    this.currentAction.points.push(point)

    this.clear(this._canvasTemp)

    this.drawActionToCanvas(this.currentAction, this._canvasTemp)
  }

  drawActionToCanvas (action, canvas) {
    this.setCanvasProperties(canvas, action.canvasProperties)

    const c = canvas.getContext('2d')
    let p1 = action.points[0]
    let p2 = action.points[1]

    c.beginPath()
    c.moveTo(p1.x, p1.y)

    for (let i = 1; i < action.points.length; i++) {
      // we pick the point between pi+1 & pi+2 as the
      // end point and p1 as our control point
      const midPoint = midPointBetween(p1, p2)
      c.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y)
      p1 = action.points[i]
      p2 = action.points[i + 1]
    }
    // Draw last line as a straight line while
    // we wait for the next point to be able to calculate
    // the bezier control point
    c.lineTo(p1.x, p1.y)
    c.stroke()
  }

  clear (canvas) {
    canvas.getContext('2d').clearRect(0, 0, this._size.width, this._size.height)
  }

  copy (source, target) {
    target.getContext('2d').drawImage(source, 0, 0, this._size.width, this._size.height)
  }

  undo () {
    this.clear(this._canvasMain)
    this._historyIndex = Math.max(this._historyIndex - 1, 0)

    if (this._historyIndex >= 0) {
      this.drawActions()
    }
  }

  redo () {
    this._historyIndex = Math.min(this._historyIndex + 1, this.actions.length)

    if (this._historyIndex <= this.actions.length) {
      this.clear(this._canvasMain)
      this.drawActions()
    }
  }

  redraw () {
    this.clear(this._canvasMain)
    this.drawActions()
  }

  drawActions () {
    for (let i = 0; i < this._historyIndex; i++) {
      const action = this.actions[i]

      switch (action.type) {
        case 'stroke':
          this.drawActionToCanvas(action, this._canvasMain)
          break
        case 'erase':
          this.clear(this._canvasMain)
          break
      }

      this.lastActionType = action.type
    }
  }

  erase () {
    if (this.lastActionType === 'erase') {
      return
    }

    this.pushAction(new Action('erase'))
    this.clear(this._canvasMain)
  }

  setCanvasProperties (canvas, props) {
    const context = canvas.getContext('2d')

    Object.keys(props).forEach(p => {
      context[p] = props[p]
    })
  }
}

class DrawAction {
  constructor (canvasProperties) {
    this.type = 'stroke'
    this.canvasProperties = canvasProperties
    this.points = []
  }
}

class Action {
  constructor (type) {
    this.type = type
  }
}
