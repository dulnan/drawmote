import {
  WebGLRenderTarget,
  Scene,
  Raycaster,
  ObjectLoader,
  SpotLightHelper,
  Vector3,
  Quaternion,
  PlaneBufferGeometry,
  TextureLoader,
  Mesh,
  Matrix4,
  Object3D,
  Math as ThreeMath,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  CircleGeometry,
  Geometry,
  Path,
  BufferGeometry,
  LineBasicMaterial,
  Line,
  MeshBasicMaterial,
  OrthographicCamera,
  Group,
  BoxGeometry,
  LinearFilter as THREELinearFilter,
  NearestFilter as THREENearestFilter
} from 'three'

import { ANIMATION_SCREEN_VIEWPORT, COLORS, TOOLBAR_SLIDERS } from '@/settings'

const LINE_COLOR = 0xeeeeee

export default class DrawingScene {
  constructor() {
    this.scene = new Scene()

    const w = window.innerWidth
    const h = window.innerHeight

    this.texture = new WebGLRenderTarget(w, h, {
      minFilter: THREELinearFilter,
      magFilter: THREENearestFilter
    })

    this.camera = new OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0, 10)

    this.toolbar = new Group()
    this.toolbar.position.x = -w / 2
    this.toolbar.position.y = h / 2

    this.colors = new Group()
    this.toolbar.add(this.colors)

    this.sliders = new Group()
    this.toolbar.add(this.sliders)

    this.scene.add(this.toolbar)

    this.margin = 10
    this.padding = 16

    this.drawColorPicker()
    this.generateText()
  }

  generateText() {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.fillStyle = '#FF0000'

    context.font = 'normal ' + textHeight + 'px Arial'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillStyle = '#ff0000'
    context.fillText(text, textWidth / 2, textHeight / 2)
  }

  drawColorPicker() {
    const radius = 16
    const margin = this.margin
    const padding = this.padding

    let lastPositionX

    COLORS.forEach((color, index) => {
      let geometry = new CircleGeometry(radius, 32)
      let material = new MeshBasicMaterial({ color: color.hex })
      var circle = new Mesh(geometry, material)
      circle.position.x = radius + index * radius * 2 + index * margin + padding
      circle.position.y = -radius - padding
      lastPositionX = circle.position.x
      this.colors.add(circle)
    })

    const boundsX = lastPositionX - margin
    const boundsY = (padding * 2 + radius * 2) * -1

    var material = new LineBasicMaterial({
      color: LINE_COLOR
    })

    var geometry = new Geometry()
    geometry.vertices.push(
      new Vector3(0, boundsY, 0),
      new Vector3(boundsX, boundsY, 0),
      new Vector3(boundsX, 0, 0)
    )

    var line = new Line(geometry, material)
    this.colors.add(line)
  }

  drawSlider() {
    TOOLBAR_SLIDERS.forEach(slider => {
      f
    })
  }
}
