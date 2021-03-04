import { getPosition } from './getPosition'
import { CompositionType } from './types'

export function isParagraphStart(
  composition: CompositionType,
  path: string[],
  offset: number,
  anchorValue?: string
): Boolean {
  if (anchorValue === '\u200B') {
    return true
  }
  if (offset > 0) {
    return false
  }
  return (
    getPosition(composition, path)
      .slice(1)
      .reduce((sum, p) => sum + p, 0) === 0
  )
}
