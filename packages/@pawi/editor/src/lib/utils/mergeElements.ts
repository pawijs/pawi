import { makeRef } from './makeRef';
import { ChangesType, CompositionType, ElementRefType, ElementsType, ElementType, GroupElementType, isStringElement, StringElementType } from './types';

/*********************************************************************
 * FIXME: ALL THIS NEEDS TO WORK ON ChangesType, not operations !
 * This would let us simplify this thing and use 'simplify' instead
 * of rewriting the logic.
 *********************************************************************
 */

export function addDepth(
  a: StringElementType,
  inPlace: boolean = false
): GroupElementType {
  const parent = (inPlace ? a : Object.assign({}, a)) as GroupElementType
  parent.g = {
    [makeRef()]: {
      t: 'T',
      p: 0,
      i: a.i,
    },
  }
  delete parent.i
  return parent
}

// Note that target === last element in para (can be para itself)
// and that source === first element in para (can be para itself)
function moveInPara(
  composition: CompositionType,
  targetId: string,
  source: ElementType,
  sourceId: string,
  alastPosition: number,
  changes: ChangesType
): number {
  if (isStringElement(source) && !source.i.length) {
    // ignore
    return alastPosition
  }
  const { elements } = changes
  let lastPosition = alastPosition
  const targetPath = [targetId]
  const target = elements[targetId]
    ? elements[targetId].elem
    : composition.g[targetId]

  if (!target.g) {
    // No children, make first
    elements[targetId] = {
      op: 'update',
      path: [targetId],
      pathId: targetId,
      elem: addDepth(target as StringElementType),
    }
    lastPosition = 0
  } else if (lastPosition === -1) {
    lastPosition = Math.max(...Object.values(target.g).map(elem => elem.p))
  }

  const t = source.t === 'P' ? 'T' : source.t
  // Move into target paragraph
  const path = targetPath.concat(sourceId)
  const pathId = path.join('.')
  elements[pathId] = {
    op: 'create',
    path,
    pathId,
    elem: Object.assign({}, source, { p: ++lastPosition, t }),
  }

  return lastPosition
}

function mergeTwoPara(
  composition: CompositionType,
  start: ElementRefType,
  end: ElementRefType,
  changes: ChangesType
): void {
  const endParaPath = end.path.slice(0, 1)
  const endId = endParaPath[0]
  const startId = start.path[0]
  const { elements } = changes

  // Move each element from end para inside start para.
  // Make sure to move updated 'end' block
  let lastPosition = start.elem.p
  const endParaRef = elements[endId]
  const flatOriginal = isStringElement(composition.g[endId])
  const endElem = endParaRef ? endParaRef.elem : composition.g[endId]
  const children = Object.assign(
    {},
    endElem.g,
    flatOriginal
      ? Object.assign(
          {},
          ...Object.keys(elements)
            .map(k => elements[k])
            .filter(ref => ref.path[0] === endId && ref.path.length > 1)
            .map(ref => ({ [ref.path[ref.path.length - 1]]: ref.elem }))
        )
      : {}
  ) as ElementsType

  let skip = true
  const endRef = end.path[1]

  Object.keys(children)
    .sort((a, b) => children[a].p - children[b].p)
    .forEach((ref, idx) => {
      let elem = children[ref]
      if (ref === endRef) {
        // We are on end element or the parent of end element
        if (end.path.length === 2) {
          // We are on end element
          elem = end.elem
        } else {
          // We are on the parent of end element
          // Need to write 'end' update inside elem (it's parent)
          elem = Object.assign({}, elem, {
            g: Object.assign({}, elem.g, {
              [end.path[end.path.length - 1]]: end.elem,
            }),
          })
          delete elem.i
        }
        // Stop skipping
        skip = false
      } else if (skip) {
        // deleted, ignore
        return
      }
      lastPosition = moveInPara(
        composition,
        startId,
        elem,
        flatOriginal && ref === endRef ? endId : ref,
        lastPosition,
        changes
      )
    })
}

export function mergeElements(
  composition: CompositionType,
  changes: ChangesType
) {
  const { start, end } = changes
  if (start.path[0] === end.path[0]) {
    // Same paragraph
    // nothing to do here: simplify will do the job.
    return
  } else if (end.path.length === 1) {
    const targetId = start.path[0]
    moveInPara(composition, targetId, end.elem, end.path[0], -1, changes)
  } else {
    mergeTwoPara(composition, start, end, changes)
  }

  // Delete operation
  const { elements } = changes
  const endId = end.path[0]
  Object.keys(elements).forEach(pathId => {
    if (pathId.startsWith(endId)) {
      delete elements[pathId]
    }
  })
  elements[endId] = {
    op: 'delete',
    path: [endId],
    pathId: endId,
    elem: end.elem,
  }
}
