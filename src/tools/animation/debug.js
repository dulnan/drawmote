import * as dat from 'dat.gui'
// require('three/examples/js/controls/OrbitControls')
import { CAMERA, PHONE } from './keyframes'

const THREE = window.THREE

const round = (value) => {
  return Math.round(value * 1000000) / 1000000
}

export default class AnimationDebug {
  constructor(rectLight, cameraAnimation, phoneAnimation) {
    this.gui = null

    this.rectLight = rectLight
    this.cameraAnimation = cameraAnimation
    this.phoneAnimation = phoneAnimation

    window.getCameraState = (init) => {
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

    window.getPhoneState = (init) => {
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
  }

  seekAnimation(step) {
    if (this.animeAnimation) {
      this.animeAnimation.seek(this.animeAnimation.duration * (step / 100))
    }
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

  addTargetSphere() {
    if (this._debug) {
      var geometry = new THREE.SphereGeometry(0.1, 32, 32)
      var material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
      this.sphere = new THREE.Mesh(geometry, material)
      this.webgl.scene.add(this.sphere)
    }
  }

  updateGui() {
    if (this._debug) {
      window.clearTimeout(this.guiUpdateTimeline)

      this.guiUpdateTimeline = window.setTimeout(() => {
        Object.keys(this.gui.__folders).forEach((folderKey) => {
          this.gui.__folders[folderKey].updateDisplay()
        })
      }, 1000)
    }
  }

  addGui() {
    this.gui = new dat.GUI({ width: 300 })
    this.gui.open()
    var param = {
      motion: true,
      width: this.rectLight.width,
      height: this.rectLight.height,
      color: this.rectLight.color.getHex(),
      intensity: this.rectLight.intensity
    }
    this.gui.add(param, 'motion')
    var lightFolder = this.gui.addFolder('Light')

    lightFolder.addColor(param, 'color').onChange((val) => {
      this.rectLight.color.setHex(val)
    })

    lightFolder
      .add(param, 'intensity', 0.0, 10.0)
      .step(0.01)
      .onChange((val) => {
        this.rectLight.intensity = val
      })

    let cameraFolder = this.gui.addFolder('Camera')

    Object.keys(this.cameraAnimation).forEach((key) => {
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

    Object.keys(this.phoneAnimation).forEach((key) => {
      phoneFolder
        .add(this.phoneAnimation, key, -20, 20)
        .step(0.001)
        .onChange(this.updatePhone.bind(this))
    })

    let spotlightFolder = this.gui.addFolder('SpotLight')

    let props = ['x', 'y', 'z']
    props.forEach((key) => {
      spotlightFolder
        .add(this.objectLightTop.position, key, -20, 20)
        .step(0.001)
    })

    let actionFolder = this.gui.addFolder('Actions')

    actionFolder.add(this, 'animateEnter')

    actionFolder.open()
  }

  dispose() {
    this.gui.destroy()
  }
}
