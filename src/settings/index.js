export const COLORS = [
  {
    name: 'greyLight',
    rgb: [237, 238, 236]
  },
  {
    name: 'blue',
    rgb: [196, 232, 247]
  },
  {
    name: 'green',
    rgb: [184, 221, 190]
  },
  {
    name: 'yellow',
    rgb: [253, 188, 75]
  },
  {
    name: 'red',
    rgb: [253, 121, 75]
  },
  {
    name: 'black',
    rgb: [56, 60, 71]
  }
]

export const DEFAULT_COLOR = COLORS[3]
export const RADIUS_DEFAULT = 10
export const RADIUS_MIN = 1
export const RADIUS_MAX = 70

export const HARDNESS_DEFAULT = 1
export const HARDNESS_MIN = 0
export const HARDNESS_MAX = 1

export const OPACITY_DEFAULT = 1

export const SMOOTHING_INIT = 0.85

export const SMUDGE_AMOUNT = 0.25

export const BRUSH_DEFAULT = {
  color: DEFAULT_COLOR,
  radius: RADIUS_DEFAULT,
  hardness: HARDNESS_DEFAULT,
  opacity: OPACITY_DEFAULT,
  style: 'smudge'
}
