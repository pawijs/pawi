import { isBare } from '../../helpers.js'
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
      async function load(spec, raw) {
        const url = isBare(spec)
          ? `/node_modules/${spec}`
          : `${baseUrl}/${basePath}/${spec}`

        if (raw) {
          if (cache.has(spec)) {
            return cache.get(spec) as string
          }
          const response = await window.fetch(url)
          if (!response.ok) {
            throw new Error(`Cannot load '${url}' (no access).`)
          }
          const content = await response.text()
          cache.set(spec, content)
          if (observe) {
            observe(spec, raw)
          }
          return content
        } else {
          const content = await import(url)
          cache.set(spec, content)
          return content
        }
      },
    close() {
      cache.clear()
    },
  }
}
