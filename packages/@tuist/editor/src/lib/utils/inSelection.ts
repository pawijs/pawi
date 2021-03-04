import { getPosition } from './getPosition'
import {
  ChangeType,
  CompositionType,
  ElementsType,
  isGroupElement,
  isStringElement,
  SelectionType,
} from './types'

export const SMALLEST_PATH = [-1, -1, -1]
export const BIGGEST_PATH = [Infinity, Infinity, Infinity]

// Given positions as array for each level [1, 0, 3], return elements
// in given range.
export function extractPaths(
  elements: ElementsType,
  startPosition: number[],
  endPosition: number[],
  level: number,
  parentPath: string[],
  result: ChangeType[]
) {
  const start = startPosition[level]
  const end = endPosition[level]
  Object.keys(elements)
    .sort((a, b) => (elements[a].p > elements[b].p ? 1 : -1))
    .forEach(ref => {
      const elem = elements[ref]
      const path = parentPath.concat(ref)
      const p = elem.p
      if (p < start || p > end) {
        // ignore
        // } else if (p > start && p < end) {
        // completely inside selection
        // result.push({ op: 'noop', path, pathId: path.join('.'), elem })
      } else if (isStringElement(elem)) {
        result.push({ op: 'noop', path, pathId: path.join('.'), elem })
      } else if (isGroupElement(elem)) {
        extractPaths(
          elem.g,
          p === start ? startPosition : SMALLEST_PATH,
          p === end ? endPosition : BIGGEST_PATH,
          level + 1,
          path,
          result
        )
      } else {
        // Custom tag
        result.push({ op: 'noop', path, pathId: path.join('.'), elem })
      }
    })
}

/* Return an ordered array of all paths inside the selection.
 * If a block is partially inside a selection, only affected
 * parts of the block (spans) will be returned.
 */
export function inSelection(
  composition: CompositionType,
  selection: SelectionType
): ChangeType[] {
  const anchorPosition = getPosition(composition, selection.anchorPath)

  const focusPosition =
    selection.type === 'Range'
      ? getPosition(composition, selection.focusPath)
      : anchorPosition

  const result: ChangeType[] = []

  extractPaths(
    composition.g,
    // Any missing level is "start is smaller"
    anchorPosition.concat(SMALLEST_PATH),
    // Any missing level is "end is bigger"
    focusPosition.concat(BIGGEST_PATH),
    0,
    [],
    result
  )
  return result
}
