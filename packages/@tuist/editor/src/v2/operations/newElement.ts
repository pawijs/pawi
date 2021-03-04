import { isGroupElement, StringElement } from '../types'
import { makeRef, atPath, siblings } from '../helpers'
import { ElementRef, Mutation } from '../types'

export function newElement(
  m: Mutation,
  prev: ElementRef
): ElementRef | undefined {
  const basepath = prev.path.slice(0, -1)
  const parent = atPath(m, basepath)
  if (!parent || !isGroupElement(parent)) {
    return undefined
  }
  const [, ne] = siblings(parent, basepath, prev.path.slice(-1)[0])
  const elem: StringElement = {
    t: 'T',
    p: ne ? (ne.elem.p + prev.elem.p) / 2 : prev.elem.p + 1,
    i: '',
  }
  const id = makeRef(parent.g)
  parent.g[id] = elem
  return { elem, path: [...basepath, id] }
}
