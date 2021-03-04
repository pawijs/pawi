import { caretSelection } from './caretSelection'
import { makeRef } from './makeRef'
import { addDepth } from './mergeElements'
import {
  ChangesType,
  ChangeType,
  filterChanges,
  isStringElement,
  Type,
} from './types'

/** Apply an operation on the selected list of elements.
 * Modifies the 'changes' object in place.
 */
export function applyOp(changes: ChangesType, op: string): ChangesType {
  const { elements } = changes
  const selected = filterChanges(elements, 'selected')
  // If a single element (that is not a forced break) does not contain op, make all op
  const forceOp =
    (selected.find(
      change => change.elem.t !== 'E' && change.elem.t.indexOf(op) < 0
    ) &&
      true) ||
    false

  selected.forEach((change, idx) => {
    if (change.path.length === 1) {
      const { elem, path, pathId } = change
      if (isStringElement(elem)) {
        // simple text para: need to increase depth
        const parent = addDepth(elem)
        const id = Object.keys(parent.g)[0]

        const newPath = [...path, id]
        change.op = 'create'
        change.elem = parent.g[id]
        change.path = newPath
        change.pathId = newPath.join('.')
        changes.elements[newPath.join('.')] = change

        delete changes.selection
        changes.elements[pathId] = {
          op: 'update',
          // Remove 'g' content
          elem: Object.assign({}, parent, { g: {} }),
          path,
          pathId,
        }
      }
    }

    const { elem } = change
    let t: string = elem.t
    const et = elem.t.split('+')
    if (t === 'E') {
      // Ignore
    } else if (op === 'E') {
      t = 'E'
    } else if (et.includes(op)) {
      if (!forceOp) {
        // remove op
        t = et.filter(o => o !== op).join('+')
        if (t === '') {
          t = 'T'
        }
      }
    } else if (t === 'T') {
      t = op
    } else {
      t = [...et, op].sort().join('+')
    }
    if (t !== elem.t) {
      change.elem = { ...elem, t: t as Type }
      change.op = change.op === 'create' ? 'create' : 'update'
    }
    if (op === 'E') {
      // Cannot select <BR/>
      delete change.selected
      if (changes.end !== change) {
        // Create a blank element before BR
        const path = [...change.path.slice(0, -1), makeRef()]
        const brspace: ChangeType = {
          op: 'create',
          elem: { t: elem.t, i: '', p: change.elem.p - 0.000001 },
          path,
          pathId: path.join('.'),
        }
        changes.elements[brspace.pathId] = brspace
        changes.selection = caretSelection(changes.end.path, 0)
      } else {
        // Allways create a blank element after BR
        const path = [...change.path.slice(0, -1), makeRef()]
        const newEnd: ChangeType = {
          op: 'create',
          elem: { t: elem.t, i: '', p: change.elem.p + 1 },
          path,
          pathId: path.join('.'),
          selected: true,
        }
        changes.elements[newEnd.pathId] = newEnd
        changes.end = newEnd
        changes.selection = caretSelection(path, 0)
      }
    }
  })

  return changes
}
