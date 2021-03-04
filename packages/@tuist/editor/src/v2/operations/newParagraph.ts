import { atPath, makeRef, siblings } from '../helpers'
import { ElementOptions, Mutation, Selection, StringElement } from '../types'

export function newParagraph(m: Mutation, prev: Selection) {
  const pe = atPath(m, prev.anchorPath)
  if (!pe) {
    return false
  }
  const [, ne] = siblings(m.comp, [], prev.anchorPath[0], m.sortedIds)
  const p = ne ? (pe.p + ne.elem.p) / 2 : pe.p + 1
  const elem: StringElement = { p, t: 'P', i: '' }
  const { u, a } = pe.o || {}
  let o: ElementOptions | undefined
  if (u || a) {
    o = {}
    if (a) {
      o.a = a
    }
    if (u) {
      o.u = u
    }
    pe.o = o
  }
  const id = makeRef(m.comp.g)
  m.comp.g[id] = elem
  m.sortedIds.splice(m.sortedIds.indexOf(prev.anchorPath[0]) + 1, 0, id)
  return id
}
