import { Block, Context } from 'pawi.types'

function getScreen(el: HTMLElement) {
  const sz = el.getBoundingClientRect()
  return {
    x: sz.x,
    y: sz.y,
    width: sz.width,
    height: sz.height,
  }
}

export async function init({ THREE, cache }: Context): Block {
  const container = document.getElementById('screen')
  if (!container) {
    throw new Error(`Missing '#screen' DOM container.`)
  }
  const screen = getScreen(container)

  const { renderer, camera } = cache(
    'renderer',
    () => {
      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(screen.width, screen.height)
      container.appendChild(renderer.domElement)

      const camera = new THREE.PerspectiveCamera(
        60,
        screen.width / screen.height,
        0.1,
        100
      )
      window.addEventListener('resize', () => {
        Object.assign(screen, getScreen(container))
        renderer.setSize(screen.width, screen.height)
      })
      return { renderer, camera }
    },
    ({ renderer }) => {
      container.removeChild(renderer.domElement)
    }
  )

  camera.position.z = 2
  camera.aspect = screen.width / screen.height
  camera.updateProjectionMatrix()

  renderer.setSize(screen.width, screen.height)

  return {
    renderer,
    camera,
    screen,
  }
}
