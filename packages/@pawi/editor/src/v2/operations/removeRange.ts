import {
  atPath,
  caretSelection,
  inSelection,
  lastChild,
  sortAscending,
} from '../helpers'
import { addDepth, simplify } from '.'
import {
  Element,
  ElementRef,
  isGroupElement,
  isStringElement,
  Mutation,
  RangeSelection,
} from '../types'
import { deleteParagraph } from './deleteParagraph'

function fuse(
  m: Mutation,
  start: ElementRef,
  end: ElementRef,
  range: RangeSelection
) {
  let spath = start.path
  let selem = start.elem
  const epath = end.path
  const eelem = end.elem
  if (!isStringElement(selem) || !isStringElement(eelem)) {
    return
  }
  if (selem === eelem) {
    const { i } = selem
    selem.i = i.slice(0, range.anchorOffset) + i.slice(range.focusOffset)
    return
  }
  selem.i = selem.i.slice(0, range.anchorOffset)
  eelem.i = eelem.i.slice(range.focusOffset)

  if (spath.length === 1 && epath.length === 1) {
    selem.i += eelem.i
    deleteParagraph(m, epath[0])
  } else if (spath[0] === epath[0]) {
    const parent = atPath(m, [epath[0]])
    if (parent && isGroupElement(parent)) {
      simplify(m, {}, epath[0])
    }
  } else {
    // fuse in start
    let path: string[]
    let parent: Element | undefined
    if (spath.length === 1) {
      path = spath
      addDepth(m, selem)
      parent = selem
    } else {
      path = spath.slice(0, 1)
      parent = atPath(m, path)
    }
    if (!parent || !isGroupElement(parent)) {
      return
    }
    const l = lastChild({ path, elem: parent })
    let p = l.elem.p
    if (epath.length === 1) {
      eelem.p = ++p
      eelem.t = 'T'
      parent.g[path[0]] = eelem
    } else {
      const eparent = atPath(m, epath.slice(0, -1))
      if (!eparent || !isGroupElement(eparent)) {
        return
      }
      sortAscending(eparent.g).forEach(id => {
        const e = eparent.g[id]
        e.p = ++p
        parent!.g![id] = e
      })
    }
    delete m.comp.g[epath[0]]
    simplify(m, {}, path[0])
  }
}

export function removeRange(m: Mutation, range: RangeSelection) {
  const sel = inSelection(m, range)
  const start = sel.shift()
  const end = sel.pop() || start
  sel.forEach(r => {
    if (r.path.length === 1) {
      deleteParagraph(m, r.path[0])
    } else {
      const id = r.path.pop()
      const parent = atPath(m, r.path)
      delete parent!.g![id!]
    }
  })
  if (start && end) {
    fuse(m, start, end, range)
    if (isStringElement(start.elem)) {
      start.elem.s = caretSelection(range.anchorPath, range.anchorOffset)
    } else {
      // Custom element: do not touch.
      start.elem.s = caretSelection(range.anchorPath, 0)
    }
  }
  return true
}
