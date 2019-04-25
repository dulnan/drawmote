export const COLORS = [
  {
    name: 'red',
    hex: '#F06D31'
  },
  {
    name: 'blue',
    hex: '#48bec5'
  },
  {
    name: 'green',
    hex: '#97d779'
  },
  {
    name: 'yellow',
    hex: '#ffd52b'
  },
  {
    name: 'white',
    hex: '#f0f1b7'
  },
  {
    name: 'black',
    hex: '#2a192d'
  }
]

export const DEFAULT_COLOR = COLORS[3]
export const RADIUS_DEFAULT = 16
export const RADIUS_MIN = 1
export const RADIUS_MAX = 36

export const LAZY_RADIUS_MIN = 0
export const LAZY_RADIUS_MAX = 6 * RADIUS_MAX
export const LAZY_RADIUS_DEFAULT = 20

export const HARDNESS_DEFAULT = 100
export const HARDNESS_MIN = 0
export const HARDNESS_MAX = 100

export const OPACITY_DEFAULT = 100
export const OPACITY_MIN = 1
export const OPACITY_MAX = 100

// export const SMOOTHING_INIT = 0.85
export const SMOOTHING_INIT = 1.3

export const SMUDGE_AMOUNT = 0.25

export const BRUSH_DEFAULT = {
  color: DEFAULT_COLOR,
  radius: RADIUS_DEFAULT,
  hardness: HARDNESS_DEFAULT,
  opacity: OPACITY_DEFAULT,
  style: 'smudge'
}

export const TOOLBAR_TOOLS = [
  {
    id: 'canvasClear',
    component: 'ButtonClear'
  },
  {
    id: 'undo',
    component: 'ButtonUndo'
  },
  {
    id: 'redo',
    component: 'ButtonRedo'
  }
]

export const TOOLBAR_SLIDERS = [
  {
    id: 'brushOpacity',
    component: 'SliderBrushOpacity',
    icon: ''
  },
  {
    id: 'brushRadius',
    component: 'SliderBrushRadius',
    icon: ''
  },
  {
    id: 'brushHardness',
    component: 'SliderBrushHardness',
    icon: ''
  },
  {
    id: 'lazyRadius',
    component: 'SliderLazyRadius',
    icon: ''
  },
  {
    id: 'distance',
    component: 'SliderDistance',
    icon: ''
  }
]

export const BREAKPOINT_REMOTE = 700
export const BREAKPOINT_ANIMATION = 1024

export const ANIMATION_SCREEN_VIEWPORT = {
  width: 960,
  height: 540,
  ratio: 0.75
}
