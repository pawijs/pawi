import { ChangesType, isStringElement } from './utils/types'

export function doInput(changes: ChangesType, value: string): ChangesType {
  // ======= Backspace with caret selection
  const change = changes.start
  const { elem } = change
  if (!isStringElement(elem)) {
    throw new Error(`Cannot change input of non-string element.`)
  }
  change.elem = Object.assign({}, elem, { i: value })
  change.op = change.op === 'create' ? 'create' : 'update'

  return changes
}
