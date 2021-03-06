import { caretSelection } from './caretSelection'
import { getAtPath } from './getAtPath'
import { getFirstChild, getLastChild } from './getNeighbours'
import {
  CompositionType,
  isRangeSelection,
  isStringElement,
  PathType,
  RangeSelectionType,
  SelectionPositionType,
  SelectionType,
} from './types'

const DUMMY_POSITION = { top: 0, left: 0 }

export function rangeSelection(
  anchorPath: PathType,
  anchorOffset: number,
  focusPath: PathType,
  focusOffset: number,
  position: SelectionPositionType = DUMMY_POSITION
): RangeSelectionType {
  return {
    type: 'Range',
    anchorPath,
    anchorOffset,
    focusPath,
    focusOffset,
    position,
  }
}

export function makeRangeSelection(
  composition: CompositionType,
  selection: SelectionType
): RangeSelectionType {
  if (isRangeSelection(selection)) {
    return selection
  }
  const elem = getAtPath(composition, selection.anchorPath)
  if (elem && isStringElement(elem)) {
    return rangeSelection(
      selection.anchorPath,
      0,
      selection.anchorPath,
      elem.i.length
    )
  }
  return rangeSelection(selection.anchorPath, 0, selection.anchorPath, 0)
}

export function selectAll(composition: CompositionType) {
  const { g } = composition
  const list = Object.keys(g).sort((a, b) => (g[a].p > g[b].p ? 1 : -1))
  const first = list[0]
  const last = list[list.length - 1]
  const start = getFirstChild({ path: [first], elem: g[first] })
  const end = getLastChild({ path: [last], elem: g[last] })
  const endElem = end.elem
  return rangeSelection(
    start.path,
    0,
    end.path,
    isStringElement(endElem) ? endElem.i.length : 0
  )
}

export function paragraphSelection(composition: CompositionType, id: string) {
  const { g } = composition
  const start = getFirstChild({ path: [id], elem: g[id] })
  const end = getLastChild({ path: [id], elem: g[id] })
  const endElem = end.elem
  if (start.elem.c) {
    return caretSelection(start.path, 0)
  } else {
    return rangeSelection(
      start.path,
      0,
      end.path,
      isStringElement(endElem) ? endElem.i.length : 0
    )
  }
}
