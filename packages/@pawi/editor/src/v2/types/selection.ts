import { Position } from './position'

export interface CaretSelection {
  anchorPath: string[]
  anchorOffset: number
  anchorValue?: string
  position: Position
  stringPath?: string // Only used by setSelection
  type: 'Caret'
}

export interface RangeSelection {
  anchorPath: string[]
  anchorOffset: number
  anchorValue?: string
  focusPath: string[]
  focusOffset: number
  position: Position
  stringPath?: string // Only used by setSelection
  type: 'Range'
}

export type Selection = CaretSelection | RangeSelection

export function isRangeSelection(
  selection: Selection
): selection is RangeSelection {
  return selection.type === 'Range'
}

export function isCaretSelection(
  selection: Selection
): selection is CaretSelection {
  return selection.type === 'Caret'
}

export function sameSelection(
  a: Selection, b:Selection
) {
  if (a.anchorOffset === b.anchorOffset && a.type === b.type && a.anchorPath.join('.') === b.anchorPath.join('.')) {
    if (isRangeSelection(a)) {
      const br = b as RangeSelection
      if (a.focusOffset === br.focusOffset && a.focusPath.join('.') === br.focusPath.join('.')) {
        return true
      }
    } else if (isCaretSelection(b)) {
      return true
    }
  }
  return false
}