import {
  atPath,
  caretSelection,
  firstDescendant,
  lastDescendant,
  rangeSelection,
} from '../helpers'
import { GroupElement, isStringElement, Mutation, Selection } from '../types'
import { addDepth } from './addDepth'
import { applyToRange } from './applyToRange'
import { newParagraph } from './newParagraph'

export function splitParagraph(m: Mutation, s: Selection) {
  const path = s.anchorPath.slice(0, 1)
  const para = atPath(m, path)
  const last = lastDescendant({ elem: para!, path })
  const id = newParagraph(m, s)
  if (!id) {
    return false
  }
  if (
    last.path.join('.') === s.anchorPath.join('.') &&
    isStringElement(last.elem) &&
    last.elem.i.length === s.anchorOffset
  ) {
    // At end of paragraph: just add new
    return caretSelection([id], 0)
  }

  const parent = atPath(m, [id]) as GroupElement
  let i = 1
  const g = m.comp.g
  const child = addDepth(m, parent)
  applyToRange(
    m,
    false,
    rangeSelection(s.anchorPath, s.anchorOffset, [id], 0),
    list =>
      list.forEach(r => {
        if (r.anchor) {
          child!.elem.t = r.elem.t
        }
        const { elem, path } = r
        if (path[0] === id) {
          return
        }
        const prevParent = g[path[0]]
        const eid = path[path.length - 1]
        elem.p = ++i
        parent.g[eid] = elem
        delete prevParent.g![eid]
      })
  )
  return caretSelection(firstDescendant({ elem: parent, path: [id] }).path, 0)
}
