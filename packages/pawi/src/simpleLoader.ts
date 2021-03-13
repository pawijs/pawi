import { isBare } from './helpers'
import { Loader } from './link.types'

export function getBaseUrl() {
  const { location } = window
  const base = `${location.protocol}//${location.host}${location.pathname}`
  return base.endsWith('/') ? base.slice(0, -1) : base
}

export function simpleLoader(basePath: string): Loader {
  const baseUrl = getBaseUrl()

  return async function load(spec: string, raw: boolean = false) {
    const url = isBare(spec)
      ? `/node_modules/${spec}`
      : `${baseUrl}/${basePath}/${spec}`

    if (raw) {
      const response = await window.fetch(url)
      if (!response.ok) {
        throw new Error(`Cannot load '${url}' (no access).`)
      }
      return response.text()
    } else {
      return import(url)
    }
  }
}
