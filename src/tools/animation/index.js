import EventEmitter from 'eventemitter3'
import anime from 'animejs'

import { ANIMATION_SCREEN_VIEWPORT } from '@/settings'
import {
  PHONE,
  PHONE_MOBILE,
  CAMERA,
  CAMERA_LEAVE,
  CAMERA_MOBILE
} from './keyframes'
import { scaleRange } from '@/tools/helpers'

import * as THREE from 'three'
import * as dat from 'dat.gui'

window.THREE = THREE

require('three/examples/js/controls/OrbitControls')
require('three/examples/js/renderers/CSS3DRenderer')
require('three/examples/js/lights/RectAreaLightUniformsLib')

const sceneObject = require('./scene.json')

const round = value => {
  return Math.round(value * 1000000) / 1000000
}

export default class ThreeAnimation extends EventEmitter {
  constructor(container, viewport, isDesktop, debug, pairingEl) {
    super()

    this._debug = debug

    this.pairingEl = pairingEl

    this.loader = new THREE.ObjectLoader()
    this.camera = null

    this.isDesktop = isDesktop

    this.webgl = {
      scene: null,
      renderer: new THREE.WebGLRenderer({ antialias: true, alpha: true })
    }

    this.css = {
      scene: new THREE.Scene(),
      renderer: new THREE.CSS3DRenderer()
    }

    this.displayScreen = null
    this.objectPhone = null
    this.objectLightTop = null

    this.dom = container

    this.container = null
    this.gui = null

    this.width = 500
    this.height = 500

    this.orbit = null

    this.features = {
      orbit: false,
      gui: true
    }

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

    this.raycaster = new THREE.Raycaster()

    this.animationFinished = false

    this.lastTick = null
    this.tickCount = 0
    this.tickDiffs = []
    this.lagCount = 0

    this.needsRedraw = true

    this.load(sceneObject)
  }

  load(json) {
    let project = json.project
    if (project.gammaInput) this.webgl.renderer.gammaInput = true
    if (project.gammaOutput) this.webgl.renderer.gammaOutput = true
    if (project.shadows) this.webgl.renderer.shadowMap.enabled = true

    this.loader.parse(json.scene, scene => {
      this.loader.parse(json.camera, camera => {
        this.setScene(scene)
        this.setCamera(camera)

        this.init()
        this.emit('ready')
      })
    })
  }

  init() {
    this.webgl.renderer.setPixelRatio(0.75)
    this.webgl.renderer.setClearColor(0x000000, 0)

    this.webgl.renderer.domElement.classList.add('renderer-webgl')
    this.dom.appendChild(this.webgl.renderer.domElement)

    this.css.renderer.setSize(window.innerWidth, window.innerHeight)
    this.css.renderer.domElement.style.position = 'absolute'
    this.css.renderer.domElement.style.top = 0
    this.css.renderer.domElement.classList.add('renderer-css')

    this.dom.appendChild(this.css.renderer.domElement)

    this.displayScreen = this.webgl.scene.getObjectByName('DisplayPlane')
    this.objectPhone = this.webgl.scene.getObjectByName('Phone')

    this.objectLightTop = this.webgl.scene.getObjectByName('SpotLightTop')
    this.objectLightTop.target = this.objectPhone
    if (this._debug) {
      this.spotLightHelper = new THREE.SpotLightHelper(this.objectLightTop)
      this.webgl.scene.add(this.spotLightHelper)
    }

    this.container = this.addCssObject('screen', this.displayScreen)

    let screenPosition = new THREE.Vector3()
    let screenScale = new THREE.Vector3()
    let screenQuaternion = new THREE.Quaternion()

    this.displayScreen.updateMatrixWorld()
    this.displayScreen.getWorldPosition(screenPosition)
    this.displayScreen.getWorldScale(screenScale)
    this.displayScreen.getWorldQuaternion(screenQuaternion)

    const rectLight = new THREE.RectAreaLight(
      0x2d1342,
      4,
      this.displayScreen.geometry.parameters.width * screenScale.x,
      this.displayScreen.geometry.parameters.height * screenScale.y
    )

    rectLight.position.copy(screenPosition)
    rectLight.position.z = rectLight.position.z + 1
    rectLight.rotation.y = THREE.Math.degToRad(180)
    this.displayScreen.add(rectLight)

    let intersectionPlane = new THREE.PlaneBufferGeometry(
      this.displayScreen.geometry.parameters.width * screenScale.x * 2,
      this.displayScreen.geometry.parameters.height * screenScale.y * 2,
      8,
      8
    )

    var mat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide
    })
    mat.opacity = 0
    mat.transparent = true
    this.intersectionPlane = new THREE.Mesh(intersectionPlane, mat)

    let rotObjectMatrix = new THREE.Matrix4()
    rotObjectMatrix.makeRotationFromQuaternion(screenQuaternion)

    this.intersectionPlane.position.copy(screenPosition)
    this.intersectionPlane.position.z = this.intersectionPlane.position.z + 0
    this.intersectionPlane.quaternion.setFromRotationMatrix(rotObjectMatrix)

    this.webgl.scene.add(this.intersectionPlane)

    this.addTargetSphere()

    const bg = this.webgl.scene.getObjectByName('ScreenBackground')

    bg.material.blending = THREE.NoBlending
    bg.material.opacity = 0

    this.addOrbitControls()

    window.camera = this.camera

    window.getCameraState = init => {
      this.camera.updateMatrixWorld()
      this.camera.updateProjectionMatrix()

      let sourceValues = CAMERA[init]

      let newValues = {
        offset: sourceValues.offset,
        options: sourceValues.options,
        values: {}
      }

      newValues.values.positionX = round(this.cameraAnimation.positionX)
      newValues.values.positionY = round(this.cameraAnimation.positionY)
      newValues.values.positionZ = round(this.cameraAnimation.positionZ)

      newValues.values.targetX = round(this.cameraAnimation.targetX)
      newValues.values.targetY = round(this.cameraAnimation.targetY)
      newValues.values.targetZ = round(this.cameraAnimation.targetZ)

      return JSON.stringify(newValues)
    }

    window.getPhoneState = init => {
      this.objectPhone.updateMatrixWorld()

      let sourceValues = PHONE[init]

      let newValues = {
        offset: sourceValues.offset,
        options: sourceValues.options,
        values: {}
      }

      newValues.values.positionX = round(this.phoneAnimation.positionX)
      newValues.values.positionY = round(this.phoneAnimation.positionY)
      newValues.values.positionZ = round(this.phoneAnimation.positionZ)

      newValues.values.rotationX = round(this.phoneAnimation.rotationX)
      newValues.values.rotationY = round(this.phoneAnimation.rotationY)
      newValues.values.rotationZ = round(this.phoneAnimation.rotationZ)

      return JSON.stringify(newValues)
    }

    window.display = this.displayScreen

    this.addGui(rectLight)
  }

  addTargetSphere() {
    if (this._debug) {
      var geometry = new THREE.SphereGeometry(0.1, 32, 32)
      var material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
      this.sphere = new THREE.Mesh(geometry, material)
      this.webgl.scene.add(this.sphere)
    }
  }

  addCssObject(name, source) {
    let container = document.createElement('div')
    container.classList.add(name + '-container')

    this.webgl.scene.updateMatrixWorld()
    this.css.scene.updateMatrixWorld()
    source.updateMatrixWorld()

    const screenWidth = source.geometry.parameters.width * 3
    const screenHeight = source.geometry.parameters.height * 3
    const rotation = new THREE.Quaternion()
    const position = new THREE.Vector3()
    const scale = new THREE.Vector3()
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
    const cssObject = new THREE.CSS3DObject(container)
    // we reference the same position and rotation

    cssObject.quaternion.copy(rotation)
    cssObject.scale.copy(new THREE.Vector3(0.01, 0.01, 0.01))
    cssObject.position.copy(position)

    // add it to the css scene
    this.css.scene.add(cssObject)

    return container
  }

  addGui(rectLight) {
    if (!this._debug) {
      return
    }

    this.gui = new dat.GUI({ width: 300 })
    this.gui.open()
    var param = {
      motion: true,
      width: rectLight.width,
      height: rectLight.height,
      color: rectLight.color.getHex(),
      intensity: rectLight.intensity
    }
    this.gui.add(param, 'motion')
    var lightFolder = this.gui.addFolder('Light')

    lightFolder.addColor(param, 'color').onChange(val => {
      rectLight.color.setHex(val)
    })

    lightFolder
      .add(param, 'intensity', 0.0, 10.0)
      .step(0.01)
      .onChange(val => {
        rectLight.intensity = val
      })

    let cameraFolder = this.gui.addFolder('Camera')

    Object.keys(this.cameraAnimation).forEach(key => {
      cameraFolder
        .add(this.cameraAnimation, key, -100, 100)
        .step(0.01)
        .onChange(this.updateCamera.bind(this))
    })

    cameraFolder
      .add(this.camera, 'zoom', 0, 4)
      .step(0.01)
      .onChange(() => {
        this.camera.updateProjectionMatrix()
        this.updateCamera()
      })

    let phoneFolder = this.gui.addFolder('Phone')

    Object.keys(this.phoneAnimation).forEach(key => {
      phoneFolder
        .add(this.phoneAnimation, key, -20, 20)
        .step(0.001)
        .onChange(this.updatePhone.bind(this))
    })

    let spotlightFolder = this.gui.addFolder('SpotLight')

    let props = ['x', 'y', 'z']
    props.forEach(key => {
      spotlightFolder
        .add(this.objectLightTop.position, key, -20, 20)
        .step(0.001)
    })

    let actionFolder = this.gui.addFolder('Actions')

    actionFolder.add(this, 'animateEnter')

    actionFolder.open()
  }

  getScreen() {
    return this.container.children[0].children[0]
  }

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

    if (this.sphere) {
      this.sphere.position.x = this.cameraAnimation.positionX
      this.sphere.position.y = this.cameraAnimation.positionY
      this.sphere.position.z = this.cameraAnimation.positionZ
    }

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

  addOrbitControls() {
    if (this.features.orbit) {
      this.orbit = new THREE.OrbitControls(
        this.camera,
        this.webgl.renderer.domElement
      )
      this.orbit.minDistance = 1
      this.orbit.maxDistance = 100
      this.orbit.enableRotate = true
      window.orbit = this.orbit
    }
  }

  setPhoneRotationFromGyro({ alpha, beta }) {
    this.phoneAnimation.rotationX = THREE.Math.degToRad(beta - 40)
    this.phoneAnimation.rotationY = THREE.Math.degToRad(alpha)

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

    let direction = new THREE.Vector3()
    let position = new THREE.Vector3()

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

  setCamera(value) {
    this.camera = value
    this.camera.aspect = 1
    this.camera.updateProjectionMatrix()
  }

  setScene(value) {
    this.webgl.scene = value
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

    if (this.css.renderer) {
      this.css.renderer.setSize(w, h)
    }
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

    this.webgl.renderer.render(this.webgl.scene, this.camera)
    this.css.renderer.render(this.css.scene, this.camera)

    this.needsRedraw = false
  }

  play() {
    this.tickCount = 0
    this.needsRedraw = true
    this.webgl.renderer.setAnimationLoop(this.animate.bind(this))
  }

  stop() {
    this.webgl.renderer.stop()
  }

  animateEnter() {
    let animeAnimation = anime.timeline({
      autoplay: false,
      complete: () => {
        this.animationFinished = true
        this.emit('animationEnd')
        anime.remove(this.animeAnimation)
        console.log('complete')
        this.animeAnimation = null
      },
      update: () => {
        this.updateGui()
        this.needsRedraw = true
      },
      begin: () => {
        console.log('begin')
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

  animateLeave(cb) {
    let animeAnimation = anime.timeline({
      autoplay: false,
      complete: () => {
        cb()
      },
      update: () => {
        this.updateGui()
      }
    })

    this.setPhoneValues(PHONE[1])
    this.setCameraValues(CAMERA[1])
    this.addToTimeline('camera', animeAnimation, [CAMERA[1], CAMERA_LEAVE])

    this.animeAnimation = animeAnimation
  }

  seekAnimation(step) {
    if (this.animeAnimation) {
      this.animeAnimation.seek(this.animeAnimation.duration * (step / 100))
    }
  }

  updateGui() {
    if (this._debug) {
      window.clearTimeout(this.guiUpdateTimeline)

      this.guiUpdateTimeline = window.setTimeout(() => {
        Object.keys(this.gui.__folders).forEach(folderKey => {
          this.gui.__folders[folderKey].updateDisplay()
        })
      }, 1000)
    }
  }

  setCameraValues({ values }) {
    this.cameraAnimation.positionX = values.positionX
    this.cameraAnimation.positionY = values.positionY
    this.cameraAnimation.positionZ = values.positionZ

    this.cameraAnimation.targetX = values.targetX
    this.cameraAnimation.targetY = values.targetY
    this.cameraAnimation.targetZ = values.targetZ
  }

  setPhoneValues({ values }) {
    this.phoneAnimation.positionX = values.positionX
    this.phoneAnimation.positionY = values.positionY
    this.phoneAnimation.positionZ = values.positionZ

    this.phoneAnimation.rotationX = values.rotationX
    this.phoneAnimation.rotationY = values.rotationY
    this.phoneAnimation.rotationZ = values.rotationZ
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
    const screenContainer = this.container

    screenContainer.style.display = 'none'
    screenContainer.style.display = 'block'
  }

  dispose() {
    while (this.dom.children.length) {
      this.dom.removeChild(this.dom.firstChild)
    }

    this.webgl.renderer.dispose()

    if (this.gui) {
      this.gui.destroy()
    }
  }
}
