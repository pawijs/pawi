import THREE from 'three'

// Every library must export a context contribution.
export interface ThreeContext {
  number: number
  time: { now: number; dt: number }
  THREE: typeof THREE
  renderer: THREE.WebGLRenderer
  camera: THREE.Camera
  screen: { x: number; y: number; height: number; width: number }
  object3D: THREE.Object3D
}
