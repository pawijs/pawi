import { ElementRef, Elements, isGroupElement } from '../types'
import { sortAscending, sortDescending } from './sorting'

export function child(
  ref: ElementRef,
  sortIds: (g: Elements) => string[]
): ElementRef {
  if (isGroupElement(ref.elem)) {
    const { elem, path } = ref
    const g = elem.g
    const ids = sortIds(g)
    const id = ids[0]
    // go further down
    return child({ path: [...path, id], elem: g[id] }, sortIds)
  } else {
    return ref
  }
}

// Last child of last child of ... or self
export function lastDescendant(ref: ElementRef): ElementRef {
  if (isGroupElement(ref.elem)) {
    return lastDescendant(child(ref, sortDescending))
  } else {
    return ref
  }
}

// Firt child of first child of ... or self
export function firstDescendant(ref: ElementRef): ElementRef {
  if (isGroupElement(ref.elem)) {
    return firstDescendant(child(ref, sortAscending))
  } else {
    return ref
  }
}

export function lastChild(ref: ElementRef) {
  return child(ref, sortAscending)
}
