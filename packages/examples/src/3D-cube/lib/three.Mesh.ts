import { Context, Node } from './context'

export function init({ THREE, object3D, cache, detached }: Context): Node {
  const mesh = cache('object3D', () => {
    const dim = 1
    const geometry = new THREE.BoxGeometry(dim, dim, dim)
    const material = new THREE.MeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true,
    })

    const mesh = new THREE.Mesh(geometry, material)
    object3D.add(mesh)
    return mesh
  })

  if (detached) {
    if (mesh.parent) {
      mesh.parent.remove(mesh)
    }
  }
  return { object3D: mesh }
}
