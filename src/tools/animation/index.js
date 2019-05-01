import EventEmitter from 'eventemitter3'
import anime from 'animejs'

import { ANIMATION_SCREEN_VIEWPORT } from '@/settings'
import { PHONE, PHONE_MOBILE, CAMERA, CAMERA_MOBILE } from './keyframes'
import { scaleRange } from '@/tools/helpers'

import DrawingScene from './DrawingScene'

import {
  WebGLRenderer,
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
  BoxGeometry,
  Math as ThreeMath,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  MeshBasicMaterial
} from 'three'

import * as THREE_CONSTANTS from 'three/src/constants'

window.THREE = {
  THREE_CONSTANTS,
  Object3D,
  MeshPhysicalMaterial,
  MeshBasicMaterial,
  Matrix4,
  Vector3
}

require('three/examples/js/renderers/CSS3DRenderer')

const sceneObject = require('./app.json')

const IS_ANIMATED = false

export default class ThreeAnimation extends EventEmitter {
  constructor(container, viewport, isDesktop, debug, pairingEl) {
    super()

    this._debug = debug

    this.drawingScene = new DrawingScene()

    this.pairingEl = pairingEl

    this.camera = null

    this.isDesktop = isDesktop

    this.webgl = {
      scene: null,
      renderer: new WebGLRenderer({ antialias: true, alpha: true })
    }

    // this.css = {
    //   scene: new Scene(),
    //   renderer: null
    // }

    // this.css.renderer = new window.THREE.CSS3DRenderer()

    this.objectPhone = null
    this.objectLightTop = null

    this.objectPhoneDisplay = null

    this.dom = container

    this.container = null

    this.width = 500
    this.height = 500

    this.cameraAnimation = {
      positionX: 0,
      positionY: 0,
      positionZ: 0,
      targetX: 0,
      targetY: 0,
      targetZ: 0
    }

    this.phoneAnimation = {
      positionX: 0,
      positionY: 0,
      positionZ: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0
    }

    this.animeAnimation = null

    this.raycaster = new Raycaster()

    this.animationFinished = false

    this.lastTick = null
    this.tickCount = 0
    this.tickDiffs = []
    this.lagCount = 0

    this.needsRedraw = true

    this.load(sceneObject)
  }

  load(json) {
    const loader = new ObjectLoader()

    let project = json.project
    if (project.gammaInput) this.webgl.renderer.gammaInput = true
    if (project.gammaOutput) this.webgl.renderer.gammaOutput = true
    if (project.shadows) this.webgl.renderer.shadowMap.enabled = true

    loader.parse(json.scene, scene => {
      loader.parse(json.camera, camera => {
        this.camera = camera
        this.camera.aspect = 1
        this.camera.updateProjectionMatrix()

        this.webgl.scene = scene

        this.init()
        this.emit('ready')
      })
    })
  }

  initPhone() {
    const phone = this.webgl.scene.getObjectByName('PhoneDisplay')

    // instantiate a loader
    var loader = new TextureLoader()

    // load a resource
    loader.load(
      // resource URL
      '/drawmote-logo-phone.png',

      // onLoad callback
      texture => {
        // in this example we create the material when the texture is loaded
        texture.anisotropy = this.webgl.renderer.capabilities.getMaxAnisotropy()
        var material = new MeshBasicMaterial({
          map: texture
        })

        material.map.minFilter = THREE_CONSTANTS.LinearFilter

        phone.material = material

        console.log(phone.material)
      },

      // onProgress callback currently not supported
      undefined,

      // onError callback
      function(err) {
        console.error('An error happened.')
      }
    )

    this.objectPhoneDisplay = phone
  }

  init() {
    const pixelRatio = window.devicePixelRatio
    this.webgl.renderer.setPixelRatio(pixelRatio)
    this.webgl.renderer.setClearColor(0x000000, 0)

    this.webgl.renderer.domElement.classList.add('renderer-webgl')
    this.dom.appendChild(this.webgl.renderer.domElement)

    const displayScreen = this.webgl.scene.getObjectByName('DisplayPlane')
    this.objectPhone = this.webgl.scene.getObjectByName('Phone')

    this.objectLightTop = this.webgl.scene.getObjectByName('SpotLightTop')
    this.objectLightTop.target = this.objectPhone
    if (this._debug) {
      this.spotLightHelper = new SpotLightHelper(this.objectLightTop)
      this.webgl.scene.add(this.spotLightHelper)
    }

    let screenPosition = new Vector3()
    let screenScale = new Vector3()
    let screenQuaternion = new Quaternion()

    displayScreen.updateMatrixWorld()
    displayScreen.getWorldPosition(screenPosition)
    displayScreen.getWorldScale(screenScale)
    displayScreen.getWorldQuaternion(screenQuaternion)

    let intersectionPlane = new PlaneBufferGeometry(
      displayScreen.geometry.parameters.width * screenScale.x * 2,
      displayScreen.geometry.parameters.height * screenScale.y * 2,
      8,
      8
    )

    var mat = new MeshStandardMaterial({
      color: 0x000000
    })
    mat.opacity = 0
    mat.transparent = true
    this.intersectionPlane = new Mesh(intersectionPlane, mat)

    let rotObjectMatrix = new Matrix4()
    rotObjectMatrix.makeRotationFromQuaternion(screenQuaternion)

    this.intersectionPlane.position.copy(screenPosition)
    this.intersectionPlane.position.z = this.intersectionPlane.position.z + 0
    this.intersectionPlane.quaternion.setFromRotationMatrix(rotObjectMatrix)

    this.webgl.scene.add(this.intersectionPlane)

    const bg = this.webgl.scene.getObjectByName('ScreenBackground')

    this.initPhone()

    var bufferMaterial = new MeshBasicMaterial({
      map: this.drawingScene.texture.texture
    })

    bg.material = bufferMaterial
  }

  addCssObject(name, source) {
    let container = document.createElement('div')
    container.classList.add(name + '-container')

    this.webgl.scene.updateMatrixWorld()
    this.css.scene.updateMatrixWorld()
    source.updateMatrixWorld()

    const multiplier = 3

    const screenWidth = ANIMATION_SCREEN_VIEWPORT.width
    const screenHeight = ANIMATION_SCREEN_VIEWPORT.height
    const rotation = new Quaternion()
    const position = new Vector3()
    const scale = new Vector3()
    source.getWorldPosition(position)
    source.getWorldScale(scale)
    source.getWorldQuaternion(rotation)

    const screenWrapper = document.createElement('div')
    screenWrapper.classList.add(name + '-wrapper')

    const drawingElement = document.createElement('div')

    drawingElement.style.width = screenWidth + 'px'
    drawingElement.style.height = screenHeight + 'px'
    container.style.width = screenWidth + 'px'
    container.style.height = screenHeight + 'px'

    screenWrapper.appendChild(drawingElement)
    container.appendChild(screenWrapper)

    // create the object3d for this element
    const cssObject = new window.THREE.CSS3DObject(container)
    // we reference the same position and rotation
    scale.divide(new Vector3(multiplier, multiplier, multiplier))

    cssObject.quaternion.copy(rotation)
    cssObject.scale.copy(scale)
    cssObject.position.copy(position)

    // add it to the css scene
    this.css.scene.add(cssObject)

    return container
  }

  // getScreen() {
  //   return this.container.children[0].children[0]
  // }

  updateCamera() {
    if (!this.camera) {
      return
    }

    this.camera.position.x = this.cameraAnimation.positionX
    this.camera.position.y = this.cameraAnimation.positionY
    this.camera.position.z = this.cameraAnimation.positionZ

    this.camera.lookAt(
      this.cameraAnimation.targetX,
      this.cameraAnimation.targetY,
      this.cameraAnimation.targetZ
    )

    if (this.isDesktop) {
      this.camera.zoom = Math.min(
        Math.max(this.width / this.height / 1.9, 0.7),
        1.3
      )
    } else {
      this.camera.zoom = 1
    }

    this.camera.updateMatrixWorld()
    this.camera.updateProjectionMatrix()
  }

  updatePhone() {
    this.objectPhone.rotation.x = this.phoneAnimation.rotationX
    this.objectPhone.rotation.y = this.phoneAnimation.rotationY
    this.objectPhone.rotation.z = this.phoneAnimation.rotationZ

    this.objectPhone.position.x = this.phoneAnimation.positionX
    this.objectPhone.position.y = this.phoneAnimation.positionY
    this.objectPhone.position.z = this.phoneAnimation.positionZ

    this.objectPhone.updateMatrixWorld()
  }

  setPhoneRotationFromGyro({ alpha, beta }) {
    this.phoneAnimation.rotationX = ThreeMath.degToRad(beta - 40)
    this.phoneAnimation.rotationY = ThreeMath.degToRad(alpha)

    this.needsRedraw = true
  }

  setPhoneRotationFromMouse(x, y) {
    if (!this.animationFinished) {
      return
    }

    const rangeX = [-0.26, 0.82]
    const rangeY = [-0.95, 0.95]

    this.phoneAnimation.rotationX =
      scaleRange(1 - y, [0, 1], [0, rangeX[1] - rangeX[0]]) + rangeX[0]
    this.phoneAnimation.rotationY =
      scaleRange(1 - x, [0, 1], [0, rangeY[1] - rangeY[0]]) + rangeY[0]

    this.updatePhone()

    this.objectPhone.updateMatrixWorld()

    this.needsRedraw = true
  }

  getIntersection() {
    if (!this.animationFinished) {
      return
    }

    let direction = new Vector3()
    let position = new Vector3()

    this.objectPhone.getWorldDirection(direction)
    this.objectPhone.getWorldPosition(position)

    direction.negate()

    this.raycaster.set(position, direction)

    let intersection

    const w = ANIMATION_SCREEN_VIEWPORT.width
    const h = ANIMATION_SCREEN_VIEWPORT.height

    var intersects = this.raycaster.intersectObject(this.intersectionPlane)
    if (intersects.length > 0) {
      intersection = { x: 0, y: 0 }
      const ix = intersects[0].uv.x
      const iy = 1 - intersects[0].uv.y

      intersection.x = scaleRange(ix, [0, 1], [0, w * 2]) - w / 2
      intersection.y = scaleRange(iy, [0, 1], [0, h * 2]) - h / 2
    }

    return intersection
  }

  setFinalCameraState() {
    if (this.isDesktop) {
      this.setCameraValues(CAMERA[1])
      this.setPhoneValues(PHONE[1])
    } else {
      this.setCameraValues(CAMERA_MOBILE[2])
      this.setPhoneValues(PHONE_MOBILE[1])
    }
    this.updateCamera()
    this.animationFinished = true
  }

  setSize(width, height) {
    const w = width
    const h = this.isDesktop ? height : width * 2

    this.width = w
    this.height = h

    if (this.animationFinished) {
      this.setFinalCameraState()
    }

    if (this.camera) {
      this.camera.aspect = w / h
      this.updateCamera()
    }

    if (this.webgl.renderer) {
      this.webgl.renderer.setSize(w, h)
    }

    // if (this.css.renderer) {
    //   this.css.renderer.setSize(w, h)
    // }
  }

  animate(t) {
    if (!this.needsRedraw && this.animationFinished) {
      this.lastTick = t
      return
    }

    if (!this.lastTick) {
      this.lastTick = t
    }

    const diff = t - this.lastTick

    this.tickDiffs.push(diff)
    if (this.tickDiffs.length > 10) {
      this.tickDiffs.shift()
    }

    const average = this.tickDiffs.reduce((p, a) => p + a) / 10

    if (this.tickDiffs.length === 10) {
      if (average > 50) {
        this.lagCount++
      } else {
        this.lagCount = Math.max(this.lagCount - 1, 0)
      }
    }

    if (this.lagCount > 10) {
      anime.remove(this.animeAnimation)
      this.webgl.renderer.setAnimationLoop(null)
      this.emit('slowPerformance')
    }

    this.lastTick = t

    if (this.animeAnimation) {
      this.animeAnimation.tick(t)
    }

    this.updateCamera()
    this.updatePhone()

    // this.webgl.renderer.setRenderTarget(null)
    // this.webgl.renderer.clear()
    // this.webgl.renderer.render(this.webgl.scene, this.camera)

    this.webgl.renderer.setRenderTarget(null)
    this.webgl.renderer.clear()
    this.webgl.renderer.render(
      this.drawingScene.scene,
      this.drawingScene.camera
    )

    this.needsRedraw = false
  }

  play() {
    this.tickCount = 0
    this.needsRedraw = true
    this.webgl.renderer.setAnimationLoop(this.animate.bind(this))
  }

  stop() {
    this.webgl.renderer.setAnimationLoop(null)
  }

  onAnimationEnd() {
    this.animationFinished = true
    this.emit('animationEnd')
    anime.remove(this.animeAnimation)
    this.animeAnimation = null
  }

  animateEnter() {
    if (!IS_ANIMATED) {
      this.onAnimationEnd()
      this.setFinalCameraState()
      return
    }

    let animeAnimation = anime.timeline({
      autoplay: false,
      complete: () => {
        this.onAnimationEnd()
      },
      update: () => {
        this.needsRedraw = true
      },
      begin: () => {
        this.needsRedraw = true
      }
    })

    if (this.isDesktop) {
      this.setPhoneValues(PHONE[1])
      this.setCameraValues(CAMERA[1])
      this.addToTimeline('camera', animeAnimation, CAMERA)
      this.addToTimeline('phone', animeAnimation, PHONE)
      animeAnimation.add(
        {
          targets: this.pairingEl,
          scale: [1.2, 1],
          opacity: [0, 1],
          transformOrigin: ['50% 50% 0', '50% 50% 0'],
          easing: 'easeInOutQuad',
          duration: 1900
        },
        '-=2000'
      )
    } else {
      this.setPhoneValues(PHONE_MOBILE[0])
      this.setCameraValues(CAMERA_MOBILE[0])
      this.addToTimeline('camera', animeAnimation, CAMERA_MOBILE)
      this.addToTimeline('phone', animeAnimation, PHONE_MOBILE)
      animeAnimation.add(
        {
          targets: this.pairingEl,
          opacity: [0, 1],
          translateY: ['20%', '0%'],
          easing: 'easeInOutQuad',
          duration: 1700
        },
        '-=1800'
      )
    }

    this.needsRedraw = true

    this.animeAnimation = animeAnimation
  }

  setObjectValues(object, values) {
    Object.keys(values).forEach(key => {
      object[key] = values[key]
    })
  }

  setCameraValues({ values }) {
    this.setObjectValues(this.cameraAnimation, values)
  }

  setPhoneValues({ values }) {
    this.setObjectValues(this.phoneAnimation, values)
  }

  addToTimeline(target, timeline, frames) {
    frames.forEach((frame, index) => {
      if (index === 0) {
        return
      }

      let animation = {
        targets:
          target === 'camera' ? this.cameraAnimation : this.phoneAnimation,
        ...frame.options
      }

      let properties = JSON.parse(JSON.stringify(frame.values))

      Object.keys(properties).forEach(key => {
        animation[key] = [frames[index - 1].values[key], properties[key]]
      })

      timeline.add(animation, frame.offset)
    })
  }

  refresh() {
    // const screenContainer = this.container
    // screenContainer.style.display = 'none'
    // screenContainer.style.display = 'block'
  }

  dispose() {
    this.stop()

    anime.remove(this.animeAnimation)

    while (this.dom.children.length) {
      this.dom.removeChild(this.dom.firstChild)
    }

    this.webgl.renderer.dispose()
  }
}
