import { LazyBrush } from 'lazy-brush'
import { getState } from '@/tools/cookies'
import Rectangle from '@/classes/Rectangle'
import Brush from '@/classes/Brush'
import { ANIMATION_SCREEN_VIEWPORT } from '@/settings'

/**
 * Build the Vuetamin data store.
 *
 * @returns {Object}
 */
export default function() {
  const cookieState = getState()
  let brushOptions = {}
  let lazyRadius = 80
  let gymoteDistance = window.innerWidth

  if (cookieState) {
    brushOptions = cookieState.brush || {}
    lazyRadius = cookieState.lazyRadius || lazyRadius
    gymoteDistance = cookieState.gymoteDistance || gymoteDistance
  }

  return {
    lazyBrush: new LazyBrush({
      radius: lazyRadius
    }),

    brush: new Brush(brushOptions),

    isPressing: false,
    touch: {
      x: 0,
      y: 0
    },

    viewport: ANIMATION_SCREEN_VIEWPORT,

    canvasRect: new Rectangle(0, 0, 0, 0),
    toolbarRect: new Rectangle(0, 0, 0, 0),
    footerRect: new Rectangle(0, 0, 0, 0),

    pointingAtToolbar: false,
    hasCalibrated: false,

    cookieTimout: null,

    canvasFilterSupported: false,

    gymoteDistance: gymoteDistance
  }
}
