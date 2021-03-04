import { getSiblings } from './getSiblings'
import { inSelection } from './inSelection'
import { makeRef } from './makeRef'
import { splitText } from './splitText'
import {
  CaretSelectionType,
  ChangesType,
  ChangeType,
  CompositionType,
  GroupElementType,
  isRangeSelection,
  isStringElement,
  PathType,
  RangeSelectionType,
  SelectionType,
} from './types'

function extractStart(
  composition: CompositionType,
  selection: RangeSelectionType,
  elemRef: ChangeType
): ChangesType {
  const { path, elem } = elemRef
  const id = path[path.length - 1]
  const { anchorOffset } = selection
  if (isStringElement(elem)) {
    if (anchorOffset === 0) {
      elemRef.selected = true
      return {
        elements: { [elemRef.pathId]: elemRef },
        start: elemRef,
        end: elemRef,
      }
    } else {
      const t = elem.t === 'P' ? 'T' : elem.t
      const { before, after } = splitText(elem.i, selection.anchorOffset)
      const first: ChangeType = {
        op: 'update',
        elem: Object.assign({}, elem, { i: before, t }),
        pathId: path.join('.'),
        path,
      }
      delete first.elem.s

      // Create new element
      const firstId = makeRef()
      const second: ChangeType = {
        op: 'create',
        selected: true,
        elem: Object.assign({}, elem, { i: after, t }),
        path: path.slice(0, -1).concat(firstId),
        pathId: path.slice(0, -1).concat(firstId).join('.'),
      }
      delete second.elem.s

      // ==== Update parent ====
      if (path.length === 1) {
        // Root element: need to update
        const parent = Object.assign({}, elem, {
          t: 'P',
          g: {},
        }) as GroupElementType
        delete parent.i
        delete parent.s

        const parentRef: ChangeType = {
          op: 'update',
          elem: parent,
          path,
          pathId: path.join('.'),
        }

        first.path = [id, firstId]
        first.op = 'create'
        first.pathId = first.path.join('.')
        first.elem.p = 0

        const secondId = makeRef()
        second.path = [id, secondId]
        second.pathId = second.path.join('.')
        second.elem.p = 1
        return {
          elements: {
            [parentRef.pathId]: parentRef,
            [first.pathId]: first,
            [second.pathId]: second,
          },
          start: first,
          end: second,
        }
      } else {
        const [, nextSibling] = getSiblings(composition, path)
        if (nextSibling) {
          second.elem.p = (elem.p + nextSibling.elem.p) / 2
        } else {
          second.elem.p = elem.p + 1
        }
        return {
          elements: { [first.pathId]: first, [second.pathId]: second },
          start: first,
          end: second,
        }
      }
    }
  } else {
    // start is a custom element
    elemRef.selected = true
    return {
      elements: { [elemRef.pathId]: elemRef },
      start: elemRef,
      end: elemRef,
      selection,
    }
  }
}

function extractEnd(
  composition: CompositionType,
  selection: RangeSelectionType,
  elemRef: ChangeType,
  reuseStart?: boolean,
  initialPath?: PathType // this is only set if reuseStart is also set.
): ChangesType {
  const { path, elem } = elemRef
  const { focusOffset } = selection
  if (isStringElement(elem)) {
    if (focusOffset === elem.i.length) {
      elemRef.selected = true
      return {
        elements: { [elemRef.pathId]: elemRef },
        start: elemRef,
        end: elemRef,
      }
    } else {
      const parentPath = path.length === 1 ? path : path.slice(0, -1)
      const t = elem.t === 'P' ? 'T' : elem.t
      const { inside, after } = splitText(elem.i, 0, focusOffset)

      let first = elemRef
      if (!reuseStart) {
        const firstPath = parentPath.concat(makeRef())
        first = {
          op: 'create',
          selected: true,
          elem: Object.assign({}, elem, { i: inside, t }),
          path: firstPath,
          pathId: firstPath.join('.'),
        }
      } else {
        first.elem.i = inside
        first.selected = true
      }
      delete first.elem.s

      // When not reusing start, we reuse the elemRef for second item.
      const secondPath = reuseStart ? parentPath.concat(makeRef()) : path
      const second: ChangeType = {
        op: 'create',
        elem: Object.assign({}, elem, { i: after, t }),
        path: secondPath,
        pathId: secondPath.join('.'),
      }
      delete second.elem.s

      // ==== Update parent ====
      if (path.length === 1) {
        // Root element: need to update
        if (reuseStart) {
          first.path = parentPath.concat(makeRef())
          first.pathId = first.path.join('.')
        } else {
          second.path = parentPath.concat(makeRef())
          second.pathId = second.path.join('.')
        }
        const parentElem = Object.assign({}, elem, {
          t: 'P',
          g: {},
        }) as GroupElementType
        const parent: ChangeType = {
          op: 'update',
          elem: parentElem,
          path: parentPath,
          pathId: parentPath.join('.'),
        }
        delete parentElem.i
        delete parentElem.s
        first.elem.p = 0
        second.elem.p = 1

        return {
          elements: {
            [parent.pathId]: parent,
            [first.pathId]: first,
            [second.pathId]: second,
          },
          start: first,
          end: second,
        }
      } else {
        // Compute position of new item.
        const [, nextSibling] = getSiblings(composition, initialPath || path)
        if (nextSibling) {
          second.elem.p = (elem.p + nextSibling.elem.p) / 2
        } else {
          second.elem.p = elem.p + 1
        }
        return {
          elements: { [first.pathId]: first, [second.pathId]: second },
          start: first,
          end: second,
        }
      }
    }
  } else {
    // end is a custom element
    elemRef.selected = true
    return {
      elements: { [elemRef.pathId]: elemRef },
      start: elemRef,
      end: elemRef,
      selection,
    }
  }
}

export function extractCaretSelection(
  composition: CompositionType,
  aSelection: CaretSelectionType,
  forceNewEnd?: boolean
): ChangesType {
  const touched = inSelection(composition, aSelection)
  const change = touched[0]
  return {
    elements: { [change.pathId]: change },
    start: change,
    end: change,
    selection: aSelection,
  }
}

/** Given a composition and a selection, returns the
 * extracted elements in the selection in 'selected'.
 * In 'updated', returns changed elements.
 * Operations must first alter 'selected' in place and then
 * process 'updated'.
 */
export function extractSelection(
  composition: CompositionType,
  selection: SelectionType
): ChangesType {
  if (!isRangeSelection(selection)) {
    return extractCaretSelection(composition, selection)
  }
  const touched = inSelection(composition, selection)

  const { anchorOffset, focusOffset } = selection
  const changes = extractStart(composition, selection, touched[0])
  if (touched.length === 1) {
    // start === end
    if (anchorOffset === 0) {
      // Selected from start
      return extractEnd(composition, selection, touched[0])
    } else {
      // Get end from the rest.
      const selection2 = Object.assign({}, selection, {
        anchorOffset: 0,
        focusOffset: focusOffset - anchorOffset,
      })
      const endChanges = extractEnd(
        composition,
        selection2,
        changes.end,
        true,
        changes.start.path
      )
      Object.assign(changes.elements, endChanges.elements)
      changes.end = endChanges.end
      return changes
    }
  }
  touched.slice(1, -1).forEach(elemRef => {
    elemRef.selected = true
    changes.elements[elemRef.pathId] = elemRef
  })
  const endChanges = extractEnd(
    composition,
    selection,
    touched[touched.length - 1]
  )
  Object.assign(changes.elements, endChanges.elements)
  changes.selection = endChanges.selection || changes.selection
  changes.end = endChanges.end
  return changes
}
