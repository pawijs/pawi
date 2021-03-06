import { caretSelection } from './utils/caretSelection'
import { extractSelection } from './utils/extractSelection'
import { getNeighbours } from './utils/getNeighbours'
import { mergeElements } from './utils/mergeElements'
import {
  ChangesType,
  ChangeType,
  CompositionType,
  isCustomElement,
  isStringElement,
  SelectionType,
} from './utils/types'

export function doDeleteKey(
  composition: CompositionType,
  selection: SelectionType,
  changes: ChangesType
): ChangesType {
  // ======= Delete with caret selection
  const change = changes.start
  const { elem, path } = change
  if (!isStringElement(elem)) {
    // remove element
    change.op = 'delete'
    // select next
    const [, next] = getNeighbours(composition, path)
    if (next) {
      changes.selection = caretSelection(next.path, 0)
    } else {
      // ???
      delete changes.selection
    }
  } else if (selection.anchorOffset === elem.i.length) {
    // Merge with next ?
    const [, next] = getNeighbours(composition, path)
    if (next) {
      if (next.path[0] !== path[0]) {
        // Next is in another paragraph
        if (isCustomElement(next.elem)) {
          // select next
          changes.selection = caretSelection(next.path, 0)
        } else {
          changes.start = change
          const nextChange: ChangeType = {
            op: 'noop',
            elem: next.elem,
            path: next.path,
            pathId: next.path.join('.'),
          }
          changes.elements[nextChange.pathId] = nextChange
          changes.end = nextChange
          const { elem } = change
          changes.selection = caretSelection(
            changes.start.path,
            isStringElement(elem) ? elem.i.length : 0
          )
          mergeElements(composition, changes)
        }
      } else {
        // next is in the same paragraph
        const { elem, path } = next
        if (isStringElement(elem)) {
          // move selection in next and delete
          const selection = caretSelection(path, 0)
          return doDeleteKey(
            composition,
            selection,
            extractSelection(composition, selection)
          )
        }
      }
    } else {
      // no next element
      // ignore: noop
    }
  } else {
    // remove one char
    change.elem = Object.assign({}, elem, {
      i:
        elem.i.substr(0, selection.anchorOffset) +
        elem.i.substr(selection.anchorOffset + 1),
    })
    if (change.elem.i === '' && path.length > 1) {
      // Empty element in paragraph: clear. if next is not a forced
      // break.
      const [prev, next] = getNeighbours(composition, path)
      if (next && next.elem.t === 'E') {
        // Normal operation
        change.op = 'update'
        changes.selection = caretSelection(
          selection.anchorPath,
          // 1 because of WHITE_SPACE
          1
        )
      } else {
        change.op = 'delete'
        const id = change.path[0]
        if (next && (next.path[0] === id || !prev)) {
          // Prefer next in same para or no previous item
          const { path } = next
          changes.selection = caretSelection(path, 0)
        } else if (prev && prev.path[0] === id) {
          // if next in another para, try to use prev
          const { elem, path } = prev
          changes.selection = caretSelection(
            path,
            isStringElement(elem) ? elem.i.length : 0
          )
        }
      }
    } else {
      change.op = 'update'
      changes.selection = caretSelection(
        selection.anchorPath,
        selection.anchorOffset
      )
    }
  }

  return changes
}
