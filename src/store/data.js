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

  const distance = viewport.width * 1.1

  const cookie = getCookie('state')
  let brushOptions = {}

  if (cookie) {
    try {
      const cookieObject = JSON.parse(cookie)

      brushOptions = cookieObject.brush
    } catch (e) {
      console.log('Invalid cookie data.')
    }
  }

  return {
    lazyBrush: new LazyBrush({
      radius: 80
    }),

    brush: new Brush(brushOptions),

    isPressing: false,
    slideY: 0,

    viewport: viewport,

    distance: distance,

    canvasRect: new Rectangle(0, 0, 0, 0),
    toolbarRect: new Rectangle(0, 0, 0, 0),
    footerRect: new Rectangle(0, 0, 0, 0),

    pointingAtToolbar: false,
    hasCalibrated: false,

    cookieTimout: null,

    canvasFilterSupported: false
  }
}
