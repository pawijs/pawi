import { Block } from '../lib/types'

export async function init(): Block {
  const el = document.querySelector('#route') as HTMLInputElement
  return {
    route(now, sliders) {
      if (!el || el.checked) {
        now()
      } else {
        sliders()
      }
    },
  }
}
