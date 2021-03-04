import { doBackspaceKey } from './doBackspaceKey'
import { doDeleteKey } from './doDeleteKey'
import { doInput } from './doInput'
import { applyOp } from './utils/applyOp'
import { caretSelection } from './utils/caretSelection'
import { changeParagraph } from './utils/changeParagraph'
import { extractSelection } from './utils/extractSelection'
import { getAtPath } from './utils/getAtPath'
import { getFirstChild, getNeighbours } from './utils/getNeighbours'
import { getSiblings } from './utils/getSiblings'
import { mergeElements } from './utils/mergeElements'
import { rangeSelection } from './utils/rangeSelection'
import { simplify } from './utils/simplify'
import {
  ChangesType,
  ChangeType,
  CompositionType,
  filterChanges,
  isRangeSelection,
  isSpecialElement,
  isStringElement,
  OperationType,
  ParagraphPayload,
  SelectionType,
} from './utils/types'

const OP_ORDER: { [op: string]: number } = { delete: 0, create: 1, update: 1 }

export function makeOps(
  changes: ChangesType,
  initialSelection: SelectionType
): OperationType[] {
  const ops: OperationType[] = []
  const { elements } = changes
  const selected: ChangeType[] = []
  Object.keys(elements)
    .map(k => elements[k])
    .sort((a, b) => {
      const aPos = OP_ORDER[a.op] || 2
      const bPos = OP_ORDER[b.op] || 2
      if (aPos === bPos) {
        return a.pathId < b.pathId ? -1 : 1
      }
      return aPos < bPos ? 1 : -1
    })
    .forEach(change => {
      if (change.op === 'delete') {
        ops.push({
          op: 'delete',
          path: change.path,
        })
      } else if (change.op === 'create' || change.op === 'update') {
        ops.push({
          op: 'update',
          path: change.path,
          value: change.elem,
        })
        if (change.resized) {
          ops.push({ op: 'resized', id: change.path[0] })
        }
      }

      if (change.selected) {
        selected.push(change)
      }
    })

  if (changes.selection) {
    ops.push({
      op: 'select',
      value: { ...changes.selection, position: initialSelection.position },
    })
    const selElem = changes.elements[changes.selection.anchorPath.join('.')]
    if (selElem && isSpecialElement(selElem.elem)) {
      ops.push({ op: 'toolbox' })
    }
  } else if (selected.length) {
    const first = selected[0]
    const last = selected[selected.length - 1]

    if (isStringElement(last.elem)) {
      ops.push({
        op: 'select',
        value: rangeSelection(
          first.path,
          0,
          last.path,
          last.elem.i.length,
          initialSelection.position
        ),
      })
      if (isSpecialElement(last.elem)) {
        ops.push({ op: 'toolbox' })
      }
    } else {
      throw new Error(`Error in makeOps, element is not a string element.`)
    }
  }

  const data = changes.data
  if (data) {
    Object.keys(data).forEach(id => {
      ops.push({ op: 'data', data: data[id], path: [id] })
    })
  }

  return ops
}

interface SimpleOp {
  [key: string]: boolean
}

const SIMPLE_OP: SimpleOp = {
  B: true,
  I: true,
  E: true,
}
export type OperationsKey =
  // changing paragraph opts
  | 'P'
  // bold
  | 'B'
  // italic
  | 'I'
  // forced return
  | 'E'
  // delete, etc
  | 'Backspace'
  | 'Delete'
  | 'Input'

function doDelete(
  changes: ChangesType,
  composition: CompositionType
): ChangesType {
  let canMerge = true
  const { elements, start, end } = changes
  // Transform selections into delete changes
  filterChanges(elements, 'selected').forEach(change => {
    delete change.selected
    change.op = change.op === 'create' ? 'noop' : 'delete'
  })
  if (start.op === 'delete') {
    // Full element deletion: find previous element
    // to set caret selection.
    const [prev] = getSiblings(composition, start.path)
    if (prev) {
      changes.start = {
        op: 'noop',
        elem: prev.elem,
        path: prev.path,
        pathId: prev.path.join('.'),
      }
      changes.elements[changes.start.pathId] = changes.start
      const { elem } = prev
      if (isStringElement(elem)) {
        changes.selection = caretSelection(prev.path, elem.i.length)
      } else {
        changes.selection = caretSelection(prev.path, 0)
      }
    } else {
      // no start to use for merge
      canMerge = false
    }
  } else {
    changes.selection = caretSelection(start.path, start.elem.i!.length)
  }

  if (end.op === 'delete') {
    // Full element deletion: find next element to set
    // end for merge.
    const [, nextRef] = getSiblings(composition, end.path)
    if (nextRef) {
      const elemRef = getFirstChild(nextRef)
      changes.end = {
        op: 'noop',
        elem: elemRef.elem,
        path: elemRef.path,
        pathId: elemRef.path.join('.'),
      }
      changes.elements[changes.end.pathId] = changes.end
    } else {
      if (!canMerge) {
        // no start and no end
        delete changes.selection
      } else {
        // has start, select there
        const { elem, path } = start
        changes.selection = caretSelection(
          path,
          isStringElement(elem) ? elem.i.length : 0
        )
      }
      canMerge = false
    }
  } else {
    if (canMerge) {
      // start exists
      changes.selection = caretSelection(start.path, start.elem.i!.length)
    } else {
      // start does not exist: use end for selection.
      changes.selection = caretSelection(end.path, 0)
    }
  }
  // Can we merge last with first ?
  if (canMerge) {
    mergeElements(composition, changes)
  }

  return changes
}

function changesForOperation(
  op: OperationsKey,
  composition: CompositionType,
  selection: SelectionType,
  opts: ParagraphPayload
): ChangesType {
  if (op === 'P') {
    return changeParagraph(composition, selection, opts)
  }

  const changes = extractSelection(composition, selection)

  if (isRangeSelection(selection)) {
    if (op === 'E') {
      // Delete selection and insert 'E'
      doDelete(changes, composition)
      return applyOp(changes, op)
    } else if (SIMPLE_OP[op]) {
      // ======= Bold, Italic, Enter on selection
      return applyOp(changes, op)
    } else if (op === 'Backspace' || op === 'Delete') {
      // ======= Delete selection
      return doDelete(changes, composition)
    } else {
      throw new Error(`Invalid operation '${op}' with range selection.`)
    }
  } else if (SIMPLE_OP[op]) {
    // Creating an empty range selection will force extractSelection
    // to create a new empty element with the given operation applied to
    // it (like bold, italic, etc).
    const sel = isRangeSelection(selection)
      ? selection
      : Object.assign({}, selection, {
          type: 'Range' as 'Range',
          focusPath: selection.anchorPath,
          focusOffset: selection.anchorOffset,
        })
    return applyOp(extractSelection(composition, sel), op)
  } else if (op === 'Backspace') {
    return doBackspaceKey(composition, selection, changes)
  } else if (op === 'Input') {
    const value = opts.i
    if (typeof value !== 'string') {
      throw new Error(`Invalid value '${value}' for 'Input' operation.`)
    }
    if (
      selection.type === 'Caret' &&
      selection.anchorOffset === value.length &&
      // Paragraph blocks work fine when typing at anchorOffset 0
      selection.anchorPath.length > 1
    ) {
      // Typing at the end of an element. Make sure selection is correct and the typing
      // should not have started at the start of the next element.
      const { spath } = composition
      const apath = selection.anchorPath.join('.')
      if (spath && spath !== apath) {
        const selElem = getAtPath(composition, spath.split('.'))
        if (selElem && isStringElement(selElem) && selElem.s) {
          const oldSelection = selElem.s
          if (oldSelection.anchorOffset === 0) {
            // Selection was at the start of an element
            const [prev] = getNeighbours(
              composition,
              oldSelection.anchorPath,
              true
            )
            if (
              prev &&
              prev.path.join('.') === apath &&
              isStringElement(prev.elem)
            ) {
              const typed = value.slice(prev.elem.i.length)
              console.log('FIX [4]', prev.path.slice(-1)[0])
              // Typing should have occured in the new element
              const fixedSelection = caretSelection(
                spath.split('.'),
                typed.length
              )
              const prevValue = prev.elem.i
              // Trick proxy into a redraw
              prev.elem.i = ''
              prev.elem.i = prevValue

              /*
              // FIXME HACK: force update on prev element
              const prevId = prev.path.slice(-1)[0]
              const el = document.querySelector(`[data-ref="${prevId}"]`)
              if (el) {
                // This is UGLY as HELL...
                el.innerHTML = prev.elem.i
              }
              */
              return doInput(
                extractSelection(composition, fixedSelection),
                typed + selElem.i
              )
            }
          }
        }
      }
    }

    return doInput(changes, value)
  } else if (op === 'Delete') {
    return doDeleteKey(composition, selection, changes)
  } else {
    throw new Error(`Invalid operation '${op}' for doOperation.`)
  }
}

export function doOperation(
  composition: CompositionType,
  selection: SelectionType,
  op: OperationsKey,
  opts: ParagraphPayload = {}
): ChangesType {
  let changes: ChangesType
  if (op === 'Input' && isRangeSelection(selection)) {
    const value = opts.i
    if (typeof value !== 'string') {
      throw new Error(`Invalid value '${value}' for 'Input' operation.`)
    }

    // Update element
    if (selection.anchorPath.join('.') === selection.focusPath.join('.')) {
      changes = extractSelection(
        composition,
        caretSelection(selection.anchorPath, selection.anchorOffset)
      )
      changes = doInput(changes, value)
      // Leave the browser's selectin as is.
      delete changes.selection
    } else {
      changes = extractSelection(composition, selection)
      changes = doInput(changes, value)
      // Set selection to end.
      changes.selection = caretSelection(changes.start.path, value.length)
      changes.start.selected = false
      // And delete.
      changes = doDelete(changes, composition)
    }
  } else {
    changes = changesForOperation(op, composition, selection, opts)
  }
  simplify(composition, changes)

  return changes
}
