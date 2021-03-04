import { mapIds } from './mapIds'
import { caretSelection } from './utils/caretSelection'
import { deleteRangeSelection } from './utils/deleteSelection'
import { extractSelection } from './utils/extractSelection'
import { getLastDescendant, getNeighbours } from './utils/getNeighbours'
import { addDepth, mergeElements } from './utils/mergeElements'
import { rangeSelection } from './utils/rangeSelection'
import { simplify } from './utils/simplify'
import {
  ChangesType,
  CompositionType,
  ElementType,
  isCustomElement,
  isGroupElement,
  isRangeSelection,
  isStringElement,
  SelectionType,
  StringElementType,
} from './utils/types'

export function insertComposition(
  composition: CompositionType,
  selection: SelectionType,
  source: CompositionType
): ChangesType {
  // Rename source ids in case copy happened inside same document.
  mapIds(composition, source)
  const paragraphs: {
    id: string
    elem: ElementType
    data?: any
  }[] = Object.keys(source.g).map(id => {
    const result: typeof paragraphs[0] = { id, elem: source.g[id] }
    if (source.data && source.data[id]) {
      result.data = source.data![id]
    }
    return result
  })
  const count = paragraphs.length

  const changes = isRangeSelection(selection)
    ? deleteRangeSelection(composition, selection)
    : // We create an empty selection to insert new content
      extractSelection(
        composition,
        rangeSelection(
          selection.anchorPath,
          selection.anchorOffset,
          selection.anchorPath,
          selection.anchorOffset
        )
      )
  // selected thing = point of insertion
  const selections = Object.keys(changes.elements)
    .map(pathId => changes.elements[pathId])
    .filter(change => change.selected)
  const insertPoint = selections[selections.length - 1]

  const canFuse =
    insertPoint &&
    !isCustomElement(insertPoint.elem) &&
    !isCustomElement(paragraphs[0].elem)

  let p = insertPoint ? composition.g[insertPoint.path[0]].p : 0
  let deltaP = 1
  if (insertPoint) {
    const [, nextPara] = getNeighbours(composition, [insertPoint.path[0]])
    const endP = nextPara ? nextPara.elem.p : undefined
    deltaP = canFuse
      ? endP && count > 1
        ? (endP - p) / (count - 1)
        : 1
      : endP
      ? (endP - p) / count
      : 1
  }

  const newSelection = caretSelection(selection.anchorPath, 0)
  const maxIdx = paragraphs.length - 1
  paragraphs.forEach((para, idx) => {
    if (idx === 0 && insertPoint && canFuse) {
      // fuse with start
      const { elem } = insertPoint
      const insertId = insertPoint.path[0]
      const newElem = para.elem
      if (isStringElement(newElem)) {
        if (!isStringElement(elem)) {
          // Abort: this should never happen
          console.error('BUG in extractSelection')
        } else {
          insertPoint.op = 'update'
          insertPoint.elem = Object.assign({}, elem, {
            i: elem.i + newElem.i,
          })
          if (idx === maxIdx) {
            newSelection.anchorPath = [...insertPoint.path]
            newSelection.anchorOffset = insertPoint.elem.i!.length
          }
        }
      } else if (isGroupElement(newElem)) {
        const keys = Object.keys(newElem.g)
        let p = insertPoint.elem.p
        let deltaP = 1
        if (isGroupElement(composition.g[insertId])) {
          // Was already a group element, find next in this thing
          const endSpan = Object.keys(changes.elements)
            .filter(pathId => pathId.startsWith(insertId + '.'))
            .map(pathId => changes.elements[pathId])
            .find(change => change.elem.p > p)
          deltaP = endSpan ? (endSpan.elem.p - p) / keys.length : 1
        } else {
          insertPoint.elem = addDepth(insertPoint.elem as StringElementType)
          insertPoint.op = 'update'
          // Group was just created and we have (0, selected: 1, rest: 2)
          const endSpan = Object.keys(changes.elements)
            .filter(pathId => pathId.startsWith(insertId + '.'))
            .map(pathId => changes.elements[pathId])
            .find(change => change.elem.p > p)
          if (endSpan) {
            endSpan.elem.p += keys.length
          }
        }

        const maxSubIdx = keys.length - 1
        keys.forEach((id, sIdx) => {
          p += deltaP
          const nElem = newElem.g[id]
          const path = [insertId, id]
          const pathId = path.join('.')
          changes.elements[pathId] = {
            op: 'create',
            elem: Object.assign({}, nElem, { p }),
            path,
            pathId,
          }
          if (idx === maxIdx && sIdx === maxSubIdx) {
            newSelection.anchorPath = path
            if (isStringElement(nElem)) {
              newSelection.anchorOffset = nElem.i.length
            } else {
              newSelection.anchorOffset = 0
            }
          }
        })
      }
    } else {
      p += deltaP
      changes.elements[para.id] = {
        op: 'create',
        elem: Object.assign({}, para.elem, { p }),
        pathId: para.id,
        path: [para.id],
      }
      if (para.data) {
        if (!changes.data) {
          changes.data = {}
        }
        changes.data![para.id] = para.data
      }
      if (idx === maxIdx) {
        const ref = getLastDescendant({ elem: para.elem, path: [para.id] })
        newSelection.anchorPath = ref.path
        if (isStringElement(ref.elem)) {
          newSelection.anchorOffset = ref.elem.i.length
        } else {
          newSelection.anchorOffset = 0
        }
      }
    }
  })

  mergeElements(composition, changes)
  simplify(composition, changes)
  changes.selection = newSelection

  return changes
}
