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

export function doBackspaceKey(
  composition: CompositionType,
  selection: SelectionType,
  changes: ChangesType
): ChangesType {
  // ======= Backspace with caret selection
  const change = changes.start
  const { elem, path } = change
  if (!isStringElement(elem) || elem.t === 'E') {
    // remove element
    change.op = 'delete'
    // select previous
    const [prev] = getNeighbours(composition, path)
    if (prev) {
      changes.selection = caretSelection(
        prev.path,
        isStringElement(prev.elem) ? prev.elem.i.length : 0
      )
    } else {
      // ???
      delete changes.selection
    }
  } else if (
    selection.anchorOffset === 0 ||
    // anchorOffset is sometimes set to 1 so that it is inserted
    // after the WHITE_SPACE
    elem.i === ''
  ) {
    if (elem.o && elem.o.n) {
      // Remove page break
      change.op = 'update'
      const o = Object.assign({}, elem.o)
      delete o.n
      change.elem = Object.assign({}, elem, { o })
      change.resized = true
    } else {
      // Merge with previous ?
      const [prev] = getNeighbours(composition, path)
      if (prev) {
        if (prev.path[0] !== path[0]) {
          // Previous is in another paragraph
          if (isCustomElement(prev.elem)) {
            if (isStringElement(elem) && elem.i === '') {
              // delete
              change.op = 'delete'
            }
            // select prev
            changes.selection = caretSelection(prev.path, 0)
          } else {
            changes.end = change
            const prevChange: ChangeType = {
              op: 'noop',
              elem: prev.elem,
              path: prev.path,
              pathId: prev.path.join('.'),
            }
            changes.elements[prevChange.pathId] = prevChange
            changes.start = prevChange
            const { elem } = prev
            changes.selection = caretSelection(
              changes.start.path,
              isStringElement(elem) ? elem.i.length : 0
            )
            mergeElements(composition, changes)
          }
        } else {
          // previous is in the same paragraph
          const { elem, path } = prev
          if (isStringElement(elem)) {
            // move selection in prev and delete
            const selection = caretSelection(path, elem.i.length)
            return doBackspaceKey(
              composition,
              selection,
              extractSelection(composition, selection)
            )
          }
        }
      } else {
        // no previous element
        // ignore: noop
      }
    }
  } else {
    // remove one char
    change.elem = Object.assign({}, elem, {
      i:
        elem.i.substr(0, selection.anchorOffset - 1) +
        elem.i.substr(selection.anchorOffset),
    })
    if (change.elem.i === '' && path.length > 1) {
      // Empty element in paragraph: clear if previous is not a forced
      // break.
      const [prev, next] = getNeighbours(composition, path)
      if (prev && prev.elem.t === 'E') {
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

        if (prev && (prev.path[0] === id || !next)) {
          // Prefer previous in same para or no next item
          const { elem, path } = prev
          changes.selection = caretSelection(
            path,
            isStringElement(elem) ? elem.i.length : 0
          )
        } else if (next && next.path[0] === id) {
          // if previous in another para, try to use next
          const { path } = next
          changes.selection = caretSelection(path, 0)
        }
      }
    } else {
      change.op = 'update'
      changes.selection = caretSelection(
        selection.anchorPath,
        selection.anchorOffset - 1
      )
    }
  }

  return changes
}
