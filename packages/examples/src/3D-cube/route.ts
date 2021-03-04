import { InitValue } from 'tuist'

export function init(): InitValue {
  const el = document.querySelector('#route') as HTMLInputElement
  return {
    route(now, sliders) {
      if (el && el.checked) {
        now()
      } else {
        sliders()
      }
    },
  }
}
