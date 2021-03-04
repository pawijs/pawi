import { MakeLoader, MakeLoaderOpts } from '../types'

export function getBaseUrl() {
  const { location } = window
  const base = `${location.protocol}//${location.host}${location.pathname}`
  return base.endsWith('/') ? base.slice(0, -1) : base
}

export function simpleLoader(opts: MakeLoaderOpts = {}): MakeLoader {
  const { observe } = opts
  const baseUrl = getBaseUrl()
  const cache = opts.cache || new Map<string, string>()

  return {
    loader: basePath =>
      async function load(name, raw) {
        const url = `${baseUrl}/${basePath}/${name}`

        if (raw) {
          if (cache.has(name)) {
            return cache.get(name) as string
          }
          const response = await window.fetch(url)
          if (!response.ok) {
            throw new Error(`Cannot load '${url}' (no access).`)
          }
          const content = await response.text()
          cache.set(name, content)
          if (observe) {
            observe(name, raw)
          }
          return content
        } else {
          const content = await import(url)
          cache.set(name, content)
          return content
        }
      },
    close() {
      cache.clear()
    },
  }
}
