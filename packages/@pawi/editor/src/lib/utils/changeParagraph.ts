import { caretSelection } from './caretSelection'
import { getAtPath } from './getAtPath'
import { getSiblings } from './getSiblings'
import {
  ChangesType,
  ChangeType,
  CompositionType,
  ElementOptionsType,
  ElementType,
  ParagraphPayload,
  SelectionType,
} from './types'

export function changeParagraph(
  composition: CompositionType,
  selection: SelectionType,
  opts: ParagraphPayload
): ChangesType {
  const path = selection.anchorPath.slice(0, 1)
  const elem = getAtPath(composition, path) as ElementType
  const newElem = Object.assign({}, elem)
  if (opts.i !== undefined) {
    newElem.i = opts.i
  }
  if (opts.c) {
    newElem.c = opts.c
    delete newElem.i
  } else {
    delete newElem.c
  }
  const u = opts.o?.u
  if (opts.o) {
    const oldu = newElem.o?.u
    const olduw = newElem.o?.uw
    newElem.o = opts.o
    if (!u) {
      if (oldu) {
        newElem.o.u = oldu
      }
      if (olduw) {
        newElem.o.uw = olduw
      }
    }
    if (elem.o && elem.o.n) {
      newElem.o.n = true
    }
  } else {
    delete newElem.o
  }
  const pathId = path.join('.')
  // resized flag forces a redraw of page (required in case options change size)
  const change: ChangeType = {
    op: 'update',
    elem: newElem,
    path,
    pathId,
    resized: true,
  }
  const changes: ChangesType = {
    elements: { [change.pathId]: change },
    selection: caretSelection(selection.anchorPath, 0, selection.position),
    start: change,
    end: change,
  }
  if (u) {
    // create empty element
    const [prev] = getSiblings(composition, path)
    if (!prev || prev.elem.o?.title) {
      // bad. Should not work.
      delete change.elem.o!.u
      if (!Object.keys(change.elem.o!).length) {
        delete change.elem.o
      }
    } else {
      const pElem = Object.assign({}, prev.elem, {
        o: { u: 'l' } as ElementOptionsType,
      })
      const pChange: ChangeType = {
        op: 'update',
        elem: pElem,
        path: prev.path,
        pathId: prev.path.join('.'),
        resized: true,
      }
      changes.elements[prev.path.join('.')] = pChange
      changes.end = pChange
    }
  }

  if (opts.data) {
    changes.data = { [path[0]]: opts.data }
  }

  return changes
}
