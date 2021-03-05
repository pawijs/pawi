import { Context, Node } from './context'

function zero() {
  return 0
}

export function init({ object3D, detached }: Context): Node {
  const rotation = object3D.rotation
  rotation.x = 0
  rotation.y = 0
  rotation.z = 0
  if (detached) {
    return {}
  }
  return {
    link({ number: rotateX }, { number: rotateY }, { number: rotateZ }) {
      const x = rotateX || zero
      const y = rotateY || zero
      const z = rotateZ || zero
      return {
        update() {
          rotation.x = x()
          rotation.y = y()
          rotation.z = z()
        },
      }
    },
  }
}
