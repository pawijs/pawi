import { Block, Context } from './types'

export async function init({ cache, detached }: Context): Block {
  const time = cache('time', () => ({ now: performance.now() / 1000, dt: 0 }))
  const current = cache('current', () => ({ loop: undefined as any }))
  if (detached) {
    // stop
    delete current.loop
    return {}
  }
  return {
    time,
    collect(children) {
      function loop() {
        if (current.loop !== loop) {
          // This avoids having multiple requestAnimationFrame running
          return
        }
        const now = performance.now() / 1000
        time.dt = now - time.now
        time.now = now
        children()
        requestAnimationFrame(loop)
      }
      current.loop = loop
      return loop
    },
  }
}
