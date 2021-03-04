import {
  ElementRef,
  Elements,
  isGroupElement,
  isRangeSelection,
  isStringElement,
  Mutation,
  Selection,
} from '../types'
import { getSelection } from './getSelection'
import { position } from './position'
import { sortAscending } from './sorting'

export const SMALLEST_PATH = [-1, -1, -1]
export const BIGGEST_PATH = [Infinity, Infinity, Infinity]

// Given positions as array for each level [1, 0, 3], return elements
// in given range.
function extractPaths(
  g: Elements,
  apos: number[],
  fpos: number[],
  level: number,
  spath: string[],
  refs: ElementRef[]
) {
  const start = apos[level]
  const end = fpos[level]
  sortAscending(g).forEach(id => {
    const elem = g[id]
    const { p } = elem
    const path = spath.concat(id)
    if (p < start || p > end) {
      // Ignore
    } else if (p > start && p < end) {
      // Completely inside selection
      refs.push({ path, elem })
    } else {
      // Touching on start or end
      if (isStringElement(elem)) {
        refs.push({ path, elem })
      } else if (isGroupElement(elem)) {
        extractPaths(
          elem.g,
          p === start ? apos : SMALLEST_PATH,
          p === end ? fpos : BIGGEST_PATH,
          level + 1,
          path,
          refs
        )
      } else {
        // Custom tag
        refs.push({ path, elem })
      }
    }
  })
}

/* Return an ordered array of all paths inside the selection.
 * If a block is partially inside a selection, only affected
 * parts of the block (spans) will be returned.
 */
export function inSelection(
  m: Mutation,
  range: Selection | undefined = getSelection(m)
): ElementRef[] {
  if (!range) {
    return []
  }
  const apos = position(m, range.anchorPath)

  const fpos = isRangeSelection(range) ? position(m, range.focusPath) : apos

  const result: ElementRef[] = []

  extractPaths(
    m.comp.g,
    // Any missing level is "start is smaller"
    apos.concat(SMALLEST_PATH),
    // Any missing level is "end is bigger"
    fpos.concat(BIGGEST_PATH),
    0,
    [],
    result
  )
  if (result.length) {
    result[0].anchor = true
    result[result.length - 1].focus = true
  }
  return result
}
