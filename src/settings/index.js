export const COLORS = [
  {
    name: 'lightblue',
    hex: '#3cc6ed'
  },
  {
    name: 'darkblue',
    hex: '#204e87'
  },
  {
    name: 'yellow',
    hex: '#ffb750'
  },
  {
    name: 'orange',
    hex: '#f36747'
  },
  {
    name: 'lightgreen',
    hex: '#c3d57f'
  },
  {
    name: 'darkgreen',
    hex: '#798f16'
  },
  {
    name: 'grey',
    hex: '#e3e3e3'
  },
  {
    name: 'darkbrown',
    hex: '#3e372e'
  }

]

export const DEFAULT_COLOR = COLORS[3]
export const RADIUS_DEFAULT = 16
export const RADIUS_MIN = 1
export const RADIUS_MAX = 36

export const LAZY_RADIUS_MIN = 3
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
  // {
  //   id: 'freeform',
  //   component: 'ToolbarButton',
  //   icon: 'icon-freeform'
  // },
  // {
  //   id: 'polygon',
  //   component: 'ToolbarButton',
  //   icon: 'icon-polygon'
  // },
  // {
  //   id: 'eraser',
  //   component: 'ToolbarButton',
  //   icon: 'icon-erase'
  // },
  {
    id: 'canvasClear',
    component: 'ButtonClear',
    icon: 'icon-delete'
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
  }
]
