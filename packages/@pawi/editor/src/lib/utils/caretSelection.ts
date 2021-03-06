import { CaretSelectionType, SelectionPositionType } from './types'

const DUMMY_POSITION = { top: 0, left: 0 }

export function caretSelection(
  path: string[],
  offset: number,
  position: SelectionPositionType = DUMMY_POSITION
): CaretSelectionType {
  return {
    type: 'Caret',
    anchorPath: path,
    anchorOffset: offset,
    position,
  }
}
