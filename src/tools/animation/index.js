import EventEmitter from 'eventemitter3'

import * as THREE from 'three'
import * as dat from 'dat.gui'
window.THREE = THREE

require('three/examples/js/controls/OrbitControls')
require('three/examples/js/renderers/CSS3DRenderer')
require('three/examples/js/lights/RectAreaLightUniformsLib')

const sceneObject = require('./app.json')

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

    this.displayScreen = null
    this.displayPhone = null

    this.objectPhone = null
    this.objectScreen = null

    this.dom = container

    this.container = null
    this.gui = null

    this.width = 500
    this.height = 500

    this.load(sceneObject)
  }

  load (json) {
    this.webgl.renderer.setPixelRatio(window.devicePixelRatio)

    let project = json.project

    if (project.gammaInput) this.webgl.renderer.gammaInput = true
    if (project.gammaOutput) this.webgl.renderer.gammaOutput = true
    if (project.shadows) this.webgl.renderer.shadowMap.enabled = true

    this.webgl.renderer.domElement.classList.add('renderer-webgl')
    this.dom.appendChild(this.webgl.renderer.domElement)

    this.css.renderer.setSize(window.innerWidth, window.innerHeight)
    this.css.renderer.domElement.style.position = 'absolute'
    this.css.renderer.domElement.style.top = 0
    this.css.renderer.domElement.classList.add('renderer-css')

    this.dom.appendChild(this.css.renderer.domElement)

    this.setScene(this.loader.parse(json.scene))
    this.setCamera(this.loader.parse(json.camera))

    var controls = new THREE.OrbitControls(this.camera, this.webgl.renderer.domElement)
    controls.minDistance = 5
    controls.maxDistance = 200

    this.displayScreen = this.webgl.scene.getObjectByName('DisplayPlane')
    this.displayPhone = this.webgl.scene.getObjectByName('PhoneDisplay')

    this.objectPhone = this.webgl.scene.getObjectByName('Phone')
    this.objectScreen = this.webgl.scene.getObjectByName('Screen')

    this.container = document.createElement('div')
    this.container.classList.add('screen-container')

    const screenWidth = this.displayScreen.geometry.parameters.width * 100
    const screenHeight = this.displayScreen.geometry.parameters.height * 100

    const screenWrapper = document.createElement('div')
    screenWrapper.classList.add('screen-wrapper')

    const drawingElement = document.createElement('div')

    drawingElement.style.width = screenWidth + 'px'
    drawingElement.style.height = screenHeight + 'px'
    this.container.style.width = screenWidth + 'px'
    this.container.style.height = screenHeight + 'px'

    screenWrapper.appendChild(drawingElement)
    this.container.appendChild(screenWrapper)

    // create the object3d for this element
    const cssObject = new THREE.CSS3DObject(this.container)
    // we reference the same position and rotation

    const screenPosition = new THREE.Vector3()
    const screenScale = new THREE.Vector3()
    this.webgl.scene.updateMatrixWorld()
    this.css.scene.updateMatrixWorld()
    this.displayScreen.getWorldPosition(screenPosition)
    this.displayScreen.getWorldScale(screenScale)
    cssObject.scale.copy(new THREE.Vector3(0.01, 0.01, 0.01))
    cssObject.position.copy(screenPosition)
    cssObject.rotation.copy(this.displayScreen.rotation)
    // add it to the css scene
    this.css.scene.add(cssObject)

    const rectLight = new THREE.RectAreaLight(
      0xffffff,
      4,
      this.displayScreen.geometry.parameters.width,
      this.displayScreen.geometry.parameters.height
    )
    rectLight.position.copy(this.displayScreen.position)
    rectLight.position.z = rectLight.position.z + 0.01
    rectLight.rotation.y = THREE.Math.degToRad(180)
    this.displayScreen.add(rectLight)

    const rectLightPhone = new THREE.RectAreaLight(
      0xffffff,
      4,
      this.displayPhone.geometry.parameters.width * 1,
      this.displayPhone.geometry.parameters.height * 1
    )
    rectLightPhone.position.copy(this.displayPhone.position)
    rectLightPhone.position.z = rectLightPhone.position.z - 0.04
    rectLightPhone.rotation.y = THREE.Math.degToRad(180)
    let rectLightHelper = new THREE.RectAreaLightHelper(rectLightPhone)
    rectLightPhone.add(rectLightHelper)
    this.displayPhone.add(rectLightPhone)

    const material = new THREE.MeshBasicMaterial()
    material.color.set('black')
    material.opacity = 0
    material.blending = THREE.NoBlending

    // this.displayScreen.material = material

    // this.displayScreen.material.opacity = 1
    // this.displayScreen.material.color.set('black')
    // this.displayScreen.material.blending = THREE.NoBlending

    const bg = this.webgl.scene.getObjectByName('ScreenBackground')

    bg.material.blending = THREE.NoBlending
    bg.material.opacity = 0

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

    lightFolder.addColor(param, 'color').onChange((val) => {
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
      .onChange((val) => {
        rectLight.intensity = val
      })

    lightFolder.open()

    lightPhoneFolder.addColor(param, 'colorPhone').onChange((val) => {
      rectLightPhone.color.setHex(val)
    })
    lightPhoneFolder
      .add(param, 'intensityPhone', 0.0, 10.0)
      .step(0.01)
      .onChange((val) => {
        rectLightPhone.intensity = val
      })

    lightPhoneFolder.open()

    this.webgl.renderer.setClearColor(0x000000, 0)
    // this.webgl.renderer.background = 0x000000
    // this.webgl.scene.background = 0x000000
    // this.webgl.scene.background = new THREE.Color(0xff0000)
  }

  addGui () {

  }

  setPhoneRotation (alpha, beta) {
    this.objectPhone.rotation.x = THREE.Math.degToRad(beta)
    this.objectPhone.rotation.y = THREE.Math.degToRad(alpha)
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
  }

  animate () {
    this.time = performance.now()

    this.webgl.renderer.render(this.webgl.scene, this.camera)
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
