import EventEmitter from 'eventemitter3'

import { ANIMATION_SCREEN_VIEWPORT } from '@/settings'
import anime from 'animejs'

import * as THREE from 'three'
import * as dat from 'dat.gui'
import { rename } from 'fs'

window.THREE = THREE

require('three/examples/js/controls/OrbitControls')
require('three/examples/js/renderers/CSS3DRenderer')
require('three/examples/js/lights/RectAreaLightUniformsLib')

require('three/examples/js/shaders/CopyShader.js')
require('three/examples/js/shaders/LuminosityShader.js')
require('three/examples/js/shaders/SobelOperatorShader.js')
require('three/examples/js/postprocessing/EffectComposer.js')
require('three/examples/js/postprocessing/RenderPass.js')
require('three/examples/js/postprocessing/ShaderPass.js')

require('three/examples/js/postprocessing/EffectComposer.js')
require('three/examples/js/postprocessing/RenderPass.js')
require('three/examples/js/postprocessing/ShaderPass.js')
require('three/examples/js/shaders/CopyShader.js')
require('three/examples/js/shaders/LuminosityHighPassShader.js')
require('three/examples/js/postprocessing/UnrealBloomPass.js')

const sceneObject = require('./app.json')

const CAMERA = [
  { 'offset': 0, 'options': { 'duration': 4000, 'delay': 0, 'elasticity': 7, 'endDelay': 0, 'easing': 'easeInOutCubic' }, 'values': { 'positionX': 3.61, 'positionY': 2.03, 'positionZ': -0.4, 'targetX': -6.44, 'targetY': -0.92, 'targetZ': 3.12 } },
  { 'offset': 1000, 'options': { 'duration': 8000, 'delay': 0, 'elasticity': 7, 'endDelay': 0, 'easing': 'easeInOutCubic' }, 'values': { 'positionX': 6.4, 'positionY': -2.39, 'positionZ': 14.97, 'targetX': -6.05, 'targetY': -2.33, 'targetZ': 0.53 } }
]

const PHONE = [
  { 'offset': 0, 'options': { 'duration': 4000, 'delay': 0, 'elasticity': 7, 'endDelay': 0, 'easing': 'easeInOutBack' }, 'values': { 'positionX': 3.265, 'positionY': -0.647, 'positionZ': 6.467, 'rotationX': 0.334, 'rotationY': 0.877, 'rotationZ': 0 } },
  { 'offset': 1000, 'options': { 'duration': 8000, 'delay': 0, 'elasticity': 7, 'endDelay': 0, 'easing': 'easeOutBack' }, 'values': { 'positionX': 0, 'positionY': -4.916, 'positionZ': 6.467, 'rotationX': -0.428531, 'rotationY': -0.624392, 'rotationZ': 0 } }
]
const round = value => {
  return Math.round(value * 1000000) / 1000000
}

const ANCHOR = new THREE.Vector3(0, 0, 0)

export default class ThreeAnimation extends EventEmitter {
  constructor (container, viewport) {
    super()

    this.loader = new THREE.ObjectLoader()
    this.camera = null

    this.time = null
    this.prevTime = null

    this.webgl = {
      scene: null,
      renderer: new THREE.WebGLRenderer({ antialias: true, alpha: true })
    }

    this.css = {
      scene: new THREE.Scene(),
      renderer: new THREE.CSS3DRenderer()
    }

    this.composer = null
    this.effectSobel = null

    this.displayScreen = null
    this.displayPhone = null

    this.objectPhone = null
    this.objectScreen = null

    this.shadowLight = null

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

    this.wrapper = null

    this.params = {
      exposure: 1.1,
      bloomStrength: 3,
      bloomThreshold: 1,
      bloomRadius: 1
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

    this.cameraPosition = new THREE.Vector3(0, 0, 0)
    this.cameraTarget = new THREE.Vector3(0, 0, 0)

    this.animeAnimation = null

    this.raycaster = new THREE.Raycaster()

    this.animationFinished = false

    this.load(sceneObject)
    // this.initBloom()
  }

  load (json) {
    let project = json.project
    if (project.gammaInput) this.webgl.renderer.gammaInput = true
    if (project.gammaOutput) this.webgl.renderer.gammaOutput = true
    if (project.shadows) this.webgl.renderer.shadowMap.enabled = true
    this.loader.parse(json.scene, (scene) => {
      this.loader.parse(json.camera, (camera) => {
        this.setScene(scene)
        this.setCamera(camera)

        this.init()
        this.initShader()
        this.animateEnter()
      })
    })
  }

  init () {
    this.webgl.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    this.webgl.renderer.setClearColor(0x000000, 0)
    this.webgl.renderer.shadowMap.enabled = true
    this.webgl.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // this.webgl.renderer.toneMapping = THREE.ReinhardToneMapping

    this.webgl.renderer.domElement.classList.add('renderer-webgl')
    this.dom.appendChild(this.webgl.renderer.domElement)

    this.objectScreen = this.webgl.scene.getObjectByName('Screen')
    this.objectScreen.position.copy(new THREE.Vector3(0, -2.04, 0))
    this.objectScreen.rotation.x = 0
    this.objectScreen.rotation.y = 0
    this.objectScreen.rotation.z = 0

    this.css.renderer.setSize(window.innerWidth, window.innerHeight)
    this.css.renderer.domElement.style.position = 'absolute'
    this.css.renderer.domElement.style.top = 0
    this.css.renderer.domElement.classList.add('renderer-css')

    this.dom.appendChild(this.css.renderer.domElement)

    this.displayScreen = this.webgl.scene.getObjectByName('DisplayPlane')
    this.displayPhone = this.webgl.scene.getObjectByName('PhoneDisplay')
    this.wrapper = this.webgl.scene.getObjectByName('Wrapper')
    this.objectPhone = this.webgl.scene.getObjectByName('Phone')
    this.objectPhone.position.x = 0
    this.objectPhone.position.y = 0
    this.objectPhone.position.z = 4
    this.shadowLight = this.webgl.scene.getObjectByName('ShadowLight')
    this.pairingPlane = this.webgl.scene.getObjectByName('PairingPlane')

    // this.shadowLight.shadow.camera.left = -10
    // this.shadowLight.shadow.camera.right = 10
    // this.shadowLight.shadow.camera.top = 10
    // this.shadowLight.shadow.camera.bottom = -10
    // this.shadowLight.shadow.camera.near = 1
    // this.shadowLight.shadow.camera.far = 400
    // this.shadowLight.shadow.mapSize.width = 4096
    // this.shadowLight.shadow.mapSize.height = 4096

    this.container = this.addCssObject('screen', this.displayScreen)

    let screenPosition = new THREE.Vector3()
    let screenScale = new THREE.Vector3()
    this.displayScreen.updateMatrixWorld()
    this.displayScreen.getWorldPosition(screenPosition)
    this.displayScreen.getWorldScale(screenScale)

    const rectLight = new THREE.RectAreaLight(
      0x2d1342,
      4,
      this.displayScreen.geometry.parameters.width * screenScale.x,
      this.displayScreen.geometry.parameters.height * screenScale.y
    )

    rectLight.position.copy(screenPosition)
    // rectLight.position.x = rectLight.position.x - 0
    // rectLight.position.y = rectLight.position.y - this.displayScreen.geometry.parameters.height / 2
    rectLight.position.z = rectLight.position.z + 1
    rectLight.rotation.y = THREE.Math.degToRad(180)
    // let rectLightHelper = new THREE.RectAreaLightHelper(rectLight)
    // rectLight.add(rectLightHelper)
    this.displayScreen.add(rectLight)

    var Sgeometry = new THREE.SphereGeometry(0.1, 32, 32)
    var Smaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
    this.sphere = new THREE.Mesh(Sgeometry, Smaterial)
    this.webgl.scene.add(this.sphere)

    const rectLightPhone = new THREE.RectAreaLight(
      0x392248,
      4.3,
      this.displayPhone.geometry.parameters.width * 1,
      this.displayPhone.geometry.parameters.height * 1
    )
    rectLightPhone.position.copy(this.displayPhone.position)
    rectLightPhone.position.z = rectLightPhone.position.z - 0.04
    rectLightPhone.rotation.y = THREE.Math.degToRad(180)
    this.displayPhone.add(rectLightPhone)

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

    this.addGui(rectLight, rectLightPhone)
  }

  addTargetSphere () {
    var geometry = new THREE.SphereGeometry(0.1, 32, 32)
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
    this.sphere = new THREE.Mesh(geometry, material)
    this.webgl.scene.add(this.sphere)
  }

  addCssObject (name, source) {
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

  initShader () {
    this.composer = new THREE.EffectComposer(this.webgl.renderer)
    this.composer.setSize(this.width, this.height)
    let renderPass = new THREE.RenderPass(this.webgl.scene, this.camera)
    this.composer.addPass(renderPass)
    // color to grayscale conversion
    const effectGrayScale = new THREE.ShaderPass(THREE.LuminosityShader)
    this.composer.addPass(effectGrayScale)
    // you might want to use a gaussian blur filter before
    // the next pass to improve the result of the Sobel operator
    // Sobel operator
    this.effectSobel = new THREE.ShaderPass(THREE.SobelOperatorShader)
    this.effectSobel.renderToScreen = true
    this.effectSobel.uniforms.resolution.value.x = window.innerWidth
    this.effectSobel.uniforms.resolution.value.y = window.innerHeight
    this.composer.addPass(this.effectSobel)
  }

  initBloom () {
    var renderScene = new THREE.RenderPass(this.webgl.scene, this.camera)
    this.bloomPass = new THREE.UnrealBloomPass(
      new THREE.Vector2(this.width, this.height),
      1.5,
      0.4,
      0.85
    )
    this.bloomPass.renderToScreen = true
    this.bloomPass.threshold = this.params.bloomThreshold
    this.bloomPass.strength = this.params.bloomStrength
    this.bloomPass.radius = this.params.bloomRadius
    this.composer = new THREE.EffectComposer(this.webgl.renderer)
    this.composer.setSize(this.width, this.height)
    this.composer.addPass(renderScene)
    this.composer.addPass(this.bloomPass)

    let folder = this.gui.addFolder('Bloom')

    folder.add(this.params, 'exposure', 0.1, 2).onChange(value => {
      this.webgl.renderer.toneMappingExposure = Math.pow(value, 4.0)
    })
    folder.add(this.params, 'bloomThreshold', 0.0, 1.0).onChange(value => {
      this.bloomPass.threshold = Number(value)
    })
    folder.add(this.params, 'bloomStrength', 0.0, 3.0).onChange(value => {
      this.bloomPass.strength = Number(value)
    })
    folder
      .add(this.params, 'bloomRadius', 0.0, 1.0)
      .step(0.01)
      .onChange(value => {
        this.bloomPass.radius = Number(value)
      })
  }

  addGui (rectLight, rectLightPhone) {
    if (!this.features.gui) {
      return
    }

    this.gui = new dat.GUI({ width: 300 })
    this.gui.open()
    var param = {
      motion: true,
      width: rectLight.width,
      height: rectLight.height,
      color: rectLight.color.getHex(),
      colorPhone: rectLightPhone.color.getHex(),
      intensity: rectLight.intensity,
      intensityPhone: rectLightPhone.intensity
    }
    this.gui.add(param, 'motion')
    var lightFolder = this.gui.addFolder('Light')
    var lightPhoneFolder = this.gui.addFolder('LightPhone')

    lightFolder.addColor(param, 'color').onChange(val => {
      rectLight.color.setHex(val)
      // this.displayScreen.material.color
      //   .copy(rectLight.color)
      //   .multiplyScalar(rectLight.intensity)
      // this.displayScreen.material.emissive
      //   .copy(rectLight.color)
      //   .multiplyScalar(rectLight.intensity / 100)
    })

    lightFolder
      .add(param, 'intensity', 0.0, 10.0)
      .step(0.01)
      .onChange(val => {
        rectLight.intensity = val
      })

    // lightFolder.open()

    lightPhoneFolder.addColor(param, 'colorPhone').onChange(val => {
      rectLightPhone.color.setHex(val)
    })
    lightPhoneFolder
      .add(param, 'intensityPhone', 0.0, 10.0)
      .step(0.01)
      .onChange(val => {
        rectLightPhone.intensity = val
      })

    // lightPhoneFolder.open()
    let cameraFolder = this.gui.addFolder('Camera')

    Object.keys(this.cameraAnimation).forEach(key => {
      cameraFolder
        .add(this.cameraAnimation, key, -100, 100)
        .step(0.01)
        .onChange(this.updateCamera.bind(this))
    })

    let phoneFolder = this.gui.addFolder('Phone')

    Object.keys(this.phoneAnimation).forEach(key => {
      phoneFolder
        .add(this.phoneAnimation, key, -20, 20)
        .step(0.001)
        .onChange(this.updatePhone.bind(this))
    })

    let actionFolder = this.gui.addFolder('Actions')

    actionFolder.add(this, 'animateEnter')

    actionFolder.open()
  }

  updateCamera () {
    this.camera.position.x = this.cameraAnimation.positionX
    this.camera.position.y = this.cameraAnimation.positionY
    this.camera.position.z = this.cameraAnimation.positionZ

    this.camera.lookAt(
      this.cameraAnimation.targetX,
      this.cameraAnimation.targetY,
      this.cameraAnimation.targetZ
    )

    this.cameraPosition.copy(this.camera.position)

    this.cameraTarget.x = this.cameraAnimation.targetX
    this.cameraTarget.y = this.cameraAnimation.targetY
    this.cameraTarget.z = this.cameraAnimation.targetZ

    this.sphere.position.copy(this.cameraTarget)

    this.camera.updateMatrixWorld()
  }

  updatePhone () {
    this.objectPhone.rotation.x = this.phoneAnimation.rotationX
    this.objectPhone.rotation.y = this.phoneAnimation.rotationY
    this.objectPhone.rotation.z = this.phoneAnimation.rotationZ

    this.objectPhone.position.x = this.phoneAnimation.positionX
    this.objectPhone.position.y = this.phoneAnimation.positionY
    this.objectPhone.position.z = this.phoneAnimation.positionZ
  }

  addOrbitControls () {
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

  setPhoneRotation (alpha, beta) {
    if (!this.animationFinished) {
      return
    }
    // this.objectPhone.position.x = 0
    // this.objectPhone.position.y = -3

    this.phoneAnimation.rotationX = THREE.Math.degToRad(beta * 27 + 0)
    this.phoneAnimation.rotationY = THREE.Math.degToRad(alpha * 36 - 0)

    this.updatePhone()

    this.objectPhone.updateMatrixWorld()

    let direction = new THREE.Vector3()
    let position = new THREE.Vector3()

    this.objectPhone.getWorldDirection(direction)
    this.objectPhone.getWorldPosition(position)

    direction.negate()

    this.raycaster.set(position, direction)

    let intersection = { x: 0, y: 0 }

    var intersects = this.raycaster.intersectObject(this.displayScreen)
    if (intersects.length > 0) {
      intersection.x = intersects[0].uv.x * ANIMATION_SCREEN_VIEWPORT.width
      intersection.y =
        (1 - intersects[0].uv.y) * ANIMATION_SCREEN_VIEWPORT.height
    }

    return intersection
  }

  getScreen () {
    return this.container.children[0].children[0]
  }

  setCamera (value) {
    this.camera = value
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  setScene (value) {
    this.webgl.scene = value
  }

  setSize (width, height) {
    this.width = width
    this.height = height

    if (this.camera) {
      this.camera.aspect = this.width / this.height
      this.camera.updateProjectionMatrix()
    }

    if (this.webgl.renderer) {
      this.webgl.renderer.setSize(width, height)
    }

    if (this.css.renderer) {
      this.css.renderer.setSize(width, height)
    }

    if (this.composer) {
      this.composer.setSize(width, height)
    }
  }

  animate (t) {
    this.animeAnimation.tick(t)

    this.time = performance.now()

    this.updateCamera()
    this.updatePhone()

    this.webgl.renderer.render(this.webgl.scene, this.camera)
    // this.composer.render(this.webgl.scene, this.camera)
    this.css.renderer.render(this.css.scene, this.camera)

    this.prevTime = this.time
  }

  play () {
    this.prevTime = performance.now()

    this.webgl.renderer.setAnimationLoop(this.animate.bind(this))
  }

  stop () {
    this.webgl.renderer.setAnimationLoop(null)
  }

  animateEnter () {
    this.setCameraValues(CAMERA[0])

    let animeAnimation = anime.timeline({
      autoplay: false,
      complete: () => {
        this.animationFinished = true
      },
      update: () => {
        this.updateCamera()
        this.updatePhone()
        this.updateGui()
      }
    })

    this.addToTimeline('camera', animeAnimation, CAMERA)
    this.addToTimeline('phone', animeAnimation, PHONE)

    this.animeAnimation = animeAnimation
  }

  seekAnimation (step) {
    if (this.animeAnimation) {
      this.animeAnimation.seek(this.animeAnimation.duration * (step / 100))
    }
  }

  updateGui () {
    window.clearTimeout(this.guiUpdateTimeline)

    this.guiUpdateTimeline = window.setTimeout(() => {
      Object.keys(this.gui.__folders).forEach(folderKey => {
        this.gui.__folders[folderKey].updateDisplay()
      })
    }, 1000)
  }

  setCameraValues (v) {
    this.camera.position.x = v.values.positionX || 0
    this.camera.position.y = v.values.positionY || 0
    this.camera.position.z = v.values.positionZ || 0

    // this.camera.quaternion.w = quaternion.w || 0
    // this.camera.quaternion.x = quaternion.x || 0
    // this.camera.quaternion.y = quaternion.y || 0
    // this.camera.quaternion.z = quaternion.z || 0

    this.updateCamera()
  }

  addToTimeline (target, timeline, frames) {
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

  dispose () {
    while (this.dom.children.length) {
      this.dom.removeChild(this.dom.firstChild)
    }

    this.webgl.renderer.dispose()

    this.gui.destroy()

    this.camera = undefined
    this.webgl.scene = undefined
    this.webgl.renderer = undefined
  }
}
