import { caretSelection } from './utils/caretSelection'
import { getAtPath } from './utils/getAtPath'
import { getFirstChild } from './utils/getNeighbours'
import { getPosition } from './utils/getPosition'
import { BIGGEST_PATH, extractPaths, SMALLEST_PATH } from './utils/inSelection'
import { makeRef } from './utils/makeRef'
import { newParagraph } from './utils/newParagraph'
import { splitText } from './utils/splitText'
import { trimLeft, trimRight } from './utils/trim'
import {
  CaretSelectionType,
  ChangeType,
  CompositionType,
  GroupElementType,
  isCustomElement,
  isStringElement,
  OperationType,
  isListItem,
} from './utils/types'

/** Returns the list of operations after enter is pressed. If the composition
 * contains a range selection, we must first apply 'deleteSelection'.
 *
 */
export function doEnter(
  composition: CompositionType,
  selection: CaretSelectionType,
  pageBreak?: boolean
) {
  let { anchorPath, anchorOffset } = selection
  const ops: OperationType[] = []

  const parentPath = anchorPath.slice(0, 1)
  let parent = composition.g[parentPath[0]] as GroupElementType
  const elem = getAtPath(composition, anchorPath)
  if (!elem) {
    return []
  }

  // 1. Create new paragraph
  const newpara = newParagraph(composition, { path: parentPath, elem: parent })
  const newelem = newpara.elem
  if (pageBreak) {
    // remove all other options
    if (newelem.o?.u) {
      // Clear columns
      delete newelem.o
    } else {
      // New page
      newelem.o = { n: true }
    }
  }

  if (isStringElement(parent)) {
    // Split text.
    if (anchorOffset < parent.i.length) {
      const { before, after } = splitText(parent.i, anchorOffset)
      parent = Object.assign({}, parent, { i: trimRight(before) })
      ops.push({
        op: 'update',
        path: parentPath,
        value: parent,
      })
      newelem.i = trimLeft(after)
    }
    // No child to move.
  } else if (!isCustomElement(elem)) {
    const anchorPosition = getPosition(composition, anchorPath)
    // 2. Collect end of paragraph
    // TODO: move this in separate function
    const touchedElements: ChangeType[] = []
    let lastPosition = -1
    extractPaths(
      parent.g,
      // Any missing level is "start is smaller"
      anchorPosition.concat(SMALLEST_PATH),
      // Any missing level is "end is bigger"
      BIGGEST_PATH,
      1,
      parentPath,
      touchedElements
    )

    touchedElements.forEach(({ path, elem }, idx) => {
      if (idx === 0) {
        if (isStringElement(elem)) {
          if (anchorOffset < elem.i.length) {
            const { before, after } = splitText(elem.i, anchorOffset)
            ops.push({
              op: 'update',
              path,
              value: Object.assign({}, elem, { i: trimRight(before) }),
            })
            newelem.i = trimLeft(after)
          }
        } else {
          // Maybe extractPaths only returns string elements. TODO: check.
          throw new Error('NOT IMPLEMENTED')
        }
      } else {
        // TODO: extract and use moveInPara from deleteSelection
        const gelem: GroupElementType = newelem as any

        if (isStringElement(newelem)) {
          gelem.g = {
            [makeRef()]: {
              t: 'T',
              p: ++lastPosition,
              i: newelem.i,
            },
          }
          delete gelem.i
        }
        gelem.g[path[path.length - 1]] = Object.assign({}, elem, {
          p: ++lastPosition,
        })

        ops.push({
          op: 'delete',
          path,
        })
      }
    })
  }

  if (isListItem(parent)) {
    if (isStringElement(parent) && parent.i === '') {
      // Double enter => make normal paragraph
      ops.push({
        op: 'delete',
        path: parentPath,
      })
    } else if (!pageBreak) {
      // Continue list
      newelem.o = Object.assign({}, parent.o)
    }
  }

  ops.push({
    op: 'update',
    path: newpara.path,
    value: newelem,
  })
  ops.push({
    op: 'select',
    value: caretSelection(
      getFirstChild({ elem: newelem, path: newpara.path }).path,
      0,
      selection.position
    ),
  })
  console.log(ops)
  return ops
}
