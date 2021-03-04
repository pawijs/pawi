import { TChild, TContext, TNode, TOptValue } from 'tuist'

import THREE from 'three'

export interface ContextTypes {
  number: number
  time: { now: number; dt: number }
  THREE: typeof THREE
  renderer: THREE.WebGLRenderer
  camera: THREE.Camera
  screen: { x: number; y: number; height: number; width: number }
  object3D: THREE.Object3D
}
// Init function
export type Context = TContext<ContextTypes>
export type Node = TNode<ContextTypes>
export type Init = (ctx: Context) => Node
// Update function (if alone)
export type Arg = TChild<Context>
export type Value = TOptValue<Context>
export type Update = (...args: Arg[]) => Value
