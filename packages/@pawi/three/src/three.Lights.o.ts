import { Block, Context } from './types'
const base = 0xff5555
const skyColor = base
const sunColor = base
const backColor = 0xff7777

export async function init({
  THREE,
  object3D,
  cache,
  detached,
}: Context): Block {
  const lights = cache('light', () => {
    const lights = new THREE.Object3D()
    // Sky light
    const sky = new THREE.PointLight(skyColor, 3, 0)
    sky.position.set(0, 20, 0)
    lights.add(sky)
    // Sun light
    const sun = new THREE.PointLight(sunColor, 3, 0)
    sun.position.set(10, 20, 10)
    lights.add(sun)
    // Back light
    const back = new THREE.PointLight(backColor, 2, 0)
    back.position.set(-10, -20, -10)
    lights.add(back)

    object3D.add(lights)
    return lights
  })

  if (detached) {
    if (lights.parent) {
      lights.parent.remove(lights)
    }
  }

  return { object3D: lights }
}
