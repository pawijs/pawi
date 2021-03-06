import { getAtPath } from './getAtPath'
import {
  CompositionType,
  ElementRefType,
  ElementsType,
  GroupElementType,
  isGroupElement,
  PathType,
} from './types'

export function SortAscending(children: ElementsType): string[] {
  return Object.keys(children).sort((a, b) => children[a].p - children[b].p)
}

export function SortDescending(children: ElementsType): string[] {
  return Object.keys(children).sort((a, b) => children[b].p - children[a].p)
}

function getChild(
  elemRef: ElementRefType,
  sorter: (children: ElementsType) => string[]
): ElementRefType {
  const parent = elemRef.elem
  if (isGroupElement(parent)) {
    const children = parent.g
    const sortedRefs = sorter(children)
    const ref = sortedRefs[0]
    const path = elemRef.path.concat([ref])
    const elem = children[ref]
    // go further down
    return getChild({ path, elem }, sorter)
  } else {
    return elemRef
  }
}

export function getFirstChild(obj: ElementRefType): ElementRefType {
  return getChild(obj, SortAscending)
}

export function getLastChild(obj: ElementRefType): ElementRefType {
  return getChild(obj, SortDescending)
}

export function getLastDescendant(ref: ElementRefType): ElementRefType {
  if (isGroupElement(ref.elem)) {
    return getLastDescendant(getChild(ref, SortDescending))
  } else {
    return ref
  }
}

/* Return two closest DOM neighbours (if found). [previous, next]
 */

export function getNeighbours(
  composition: CompositionType,
  path: PathType,
  onlySibling: boolean = false
  // FIXME: change return to { prev?: ElementRefType, next? ElementRefType }
): [ElementRefType | undefined, ElementRefType | undefined] {
  if (path.length === 0) {
    // This is root, no siblings
    return [undefined, undefined]
  }
  const ref = path[path.length - 1]
  const parentPath = path.slice(0, path.length - 1)
  const parent = getAtPath(composition, parentPath) as GroupElementType
  if (!isGroupElement(parent)) {
    // This can happen during edits where a split element is not yet changed into a group.
    return [undefined, undefined]
  }
  const children = parent.g
  const sortedRefs = SortAscending(children)
  const idx = sortedRefs.indexOf(ref)
  let prevSibling: ElementRefType | undefined
  let nextSibling: ElementRefType | undefined

  const prevSiblingRef = sortedRefs[idx - 1]
  if (prevSiblingRef) {
    prevSibling = {
      path: parentPath.concat([prevSiblingRef]),
      elem: children[prevSiblingRef],
    }
    if (!onlySibling) {
      prevSibling = getLastChild(prevSibling)
    }
  }

  const nextSiblingRef = sortedRefs[idx + 1]
  if (nextSiblingRef) {
    nextSibling = {
      path: parentPath.concat([nextSiblingRef]),
      elem: children[nextSiblingRef],
    }
    if (!onlySibling) {
      nextSibling = getFirstChild(nextSibling)
    }
  }

  if (!onlySibling && (!prevSibling || !nextSibling)) {
    // get uncles
    const uncles = getNeighbours(composition, parentPath)
    if (!prevSibling) {
      const prevUncle = uncles[0]
      if (prevUncle !== undefined) {
        prevSibling = getLastChild(prevUncle)
      }
    }
    if (!nextSibling) {
      const nextUncle = uncles[1]
      if (nextUncle !== undefined) {
        nextSibling = getFirstChild(nextUncle)
      }
    }
  }
  return [prevSibling, nextSibling]
}
