import { Context, Node } from './context'

export function init({ THREE, renderer, camera, cache }: Context): Node {
  const object3D = cache('object3d', () => new THREE.Scene())

  return {
    object3D,
    collect(children) {
      return () => {
        children()
        renderer.render(object3D, camera)
      }
    },
  }
}
