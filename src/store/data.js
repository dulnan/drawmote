import { LazyBrush } from 'lazy-brush'
import { getCookie } from '@/tools/helpers'
import Rectangle from '@/classes/Rectangle'
import Brush from '@/classes/Brush'

/**
 * Build the Vuetamin data store.
 *
 * @returns {Object}
 */
export default function () {
  const viewport = {
    width: 1280,
    height: 900,
    ratio: 1
  }

  const cookie = getCookie('state')
  let brushOptions = {}
  let lazyRadius = 80

  if (cookie) {
    try {
      const cookieObject = JSON.parse(cookie)

      brushOptions = cookieObject.brush
      lazyRadius = cookieObject.lazyRadius || 80
    } catch (e) {
      console.log('Invalid cookie data.')
    }
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

    viewport: viewport,

    canvasRect: new Rectangle(0, 0, 0, 0),
    toolbarRect: new Rectangle(0, 0, 0, 0),
    footerRect: new Rectangle(0, 0, 0, 0),

    pointingAtToolbar: false,
    hasCalibrated: false,

    cookieTimout: null,

    canvasFilterSupported: false
  }
}
