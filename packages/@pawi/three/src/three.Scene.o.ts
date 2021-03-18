import { Block, Context } from 'pawi.types'

export async function init({ THREE, renderer, camera, cache }: Context): Block {
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
