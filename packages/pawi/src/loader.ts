import { isBare } from './helpers'
import { Loader } from './link.types'

export function getBaseUrl(basePath: string) {
  return (
    '/' +
    [...window.location.pathname.split('/'), ...basePath.split('/')]
      .filter(p => p !== '' && p !== '.')
      .join('/')
  )
}

export function makeLoader(basePath: string): Loader {
  const baseUrl = getBaseUrl(basePath)
  const loader: Loader = {
    async load(spec, raw = false) {
      const url = isBare(spec) ? `/node_modules/${spec}` : `${baseUrl}/${spec}`
      if (raw) {
        const response = await window.fetch(url)
        if (!response.ok) {
          throw new Error(`Cannot load '${url}' (no access).`)
        }
        return response.text()
      } else {
        return import(url)
      }
    },
    at(dirname) {
      if (dirname === '.') {
        return loader
      } else {
        return makeLoader(basePath + '/' + dirname)
      }
    },
  }
  return loader
}
