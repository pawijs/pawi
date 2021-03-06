import { MakeLoader, MakeLoaderOpts } from '../types'
import { constants, promises } from 'fs'

import { join } from 'path'

export async function canRead(path: string) {
  try {
    await promises.access(path, constants.R_OK)
    return true
  } catch {
    return false
  }
}

export function simpleLoader(opts: MakeLoaderOpts = {}): MakeLoader {
  const { observe } = opts

  return {
    loader: basePath =>
      async function load(name, raw) {
        const path = join(basePath, name)
        if (raw) {
          if (!canRead(path)) {
            throw new Error(`Cannot load '${path}' (no access).`)
          }
          const content = await promises.readFile(path, { encoding: 'utf-8' })
          if (observe) {
            observe(name, raw)
          }
          return content
        } else {
          const content = await import(path + '?' + Date.now())
          if (observe) {
            observe(name, raw)
          }
          return content
        }
      },
    close() {},
  }
}
