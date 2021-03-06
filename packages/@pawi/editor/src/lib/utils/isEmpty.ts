import { CompositionHolder } from './types'

export function isEmptyComposition(holder: CompositionHolder): boolean {
  const { composition } = holder
  if (!composition) {
    return true
  }
  if (
    Object.keys(composition.g)
      .map(k => composition.g[k])
      .filter(p => p.c || p.g || (p.i && p.i.length)).length === 0
  ) {
    return true
  }
  return false
}
