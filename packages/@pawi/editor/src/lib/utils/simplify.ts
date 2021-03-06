import { unproxy } from '@pawi/build'
import { getTitleElem } from '../getTitle'
import { caretSelection } from './caretSelection'
import { getAtPath } from './getAtPath'
import { isTextBlock } from './isTextBlock'
import { joinText } from './joinText'
import { makeRef } from './makeRef'
import { rangeSelection } from './rangeSelection'
import {
  ChangesType,
  ChangeType,
  CompositionType,
  filterChanges,
  GroupElementRefType,
  GroupElementRefTypeById,
  GroupElementType,
  isGroupElement,
  isRangeSelection,
  isSpecialElement,
  isStringElement,
  RangeSelectionType,
  StringElementType,
} from './types'

export function simplifyParent(
  changes: ChangesType,
  parent: GroupElementRefType,
  makeSelection: boolean
): void {
  const { elements } = changes
  const { path, elem } = parent

  if (isStringElement(elem)) {
    throw new Error(`Not a valid parent at path '${path.join('.')}.`)
  }

  let last: ChangeType | undefined
  let allFused: boolean = true
  const children = elem.g

  Object.keys(children)
    .map(id => {
      const elemPath = [...path, id]
      const pathId = elemPath.join('.')
      const change: ChangeType = elements[pathId] || {
        op: 'noop',
        elem: children[id],
        path: elemPath,
        pathId: elemPath.join('.'),
      }
      return change
    })
    .filter(({ op }) => {
      return op !== 'delete'
    })
    .sort(
      // Display sort
      (a, b) => {
        return a.elem.p - b.elem.p
      }
    )
    .forEach(change => {
      const { elem } = change

      if (!last) {
        // First element: simply mark as last.
        last = change
        if (makeSelection && isTextBlock(elem) && change.selected) {
          changes.selection = rangeSelection(
            changes.selection ? changes.selection.anchorPath : change.path,
            changes.selection ? changes.selection.anchorOffset : 0,
            change.path,
            elem.i.length
          )
        }
      } else if (
        last.elem.t === elem.t &&
        isTextBlock(last.elem) &&
        isTextBlock(elem)
      ) {
        // Can merge.
        // Make a copy and make sure the element we will modify is not proxied
        let lastElem = (last.elem = unproxy(last.elem))

        // Make sure last is in updated list.
        if (!elements[last.pathId]) {
          last = Object.assign({}, last, {
            op: 'update',
            elem: lastElem,
          })
          elements[last.pathId] = last
        }
        last.op = last.op === 'create' ? 'create' : 'update'

        const newText = joinText(lastElem.i, elem.i)

        // Update selection
        if (makeSelection && change.selected) {
          if (changes.selection) {
            // update
            const sel = changes.selection as RangeSelectionType
            sel.focusPath = last.path
            sel.focusOffset = newText.length
          } else {
            // start selection from element we are appending
            changes.selection = rangeSelection(
              last.path,
              lastElem.i.length,
              last.path,
              newText.length
            )
          }
        }

        // Fuse current text element with last
        lastElem.i = newText

        // Remove elem
        change.op = change.op === 'create' ? 'noop' : 'delete'

        // Make sure change is in elements
        elements[change.pathId] = change
      } else {
        if (makeSelection && isTextBlock(elem) && change.selected) {
          if (changes.selection) {
            // extend selection
            const sel = changes.selection as RangeSelectionType
            sel.focusOffset = elem.i.length
            sel.focusPath = change.path
          } else {
            // new selection
            changes.selection = rangeSelection(
              change.path,
              0,
              change.path,
              elem.i.length
            )
          }
        }
        allFused = false
        last = change
      }
    })

  if (!last) {
    // Parent removed entirely
    const pathId = parent.path.join('.')
    Object.keys(changes.elements)
      .filter(k => k.startsWith(pathId))
      .forEach(id => {
        changes.elements[id].op = 'noop'
      })

    changes.elements[pathId] = {
      op: 'delete',
      pathId,
      path: parent.path,
      elem: parent.elem,
    }
  } else if (allFused && last.elem.t === 'T') {
    // All children fused into a single text element.
    const lastElem = last.elem
    // Remove all operations regarding this paragraph
    Object.keys(elements)
      .filter(pathId => pathId.startsWith(path[0]))
      .forEach(pathId => (elements[pathId].op = 'noop'))

    // Change parent
    const t =
      lastElem.t === 'T' ? parent.elem.t : `${parent.elem.t}+${lastElem.t}`
    const elem = Object.assign({}, parent.elem, {
      t,
      i: lastElem.i,
    }) as StringElementType
    delete elem.g

    if (changes.selection) {
      const sel = changes.selection
      if (sel.anchorPath[0] === path[0]) {
        // Now the selection is in the root paragraph (but we keep the same offset)
        sel.anchorPath = path
      }
      if (isRangeSelection(sel)) {
        if (sel.focusPath[0] === path[0]) {
          sel.focusPath = path
        }
      }
    }
    const pathId = path.join('.')
    elements[pathId] = { op: 'update', elem, path, pathId }
  }
}

/** Ensure last paragraph in composition is a plain text one. Also ensure that if we had a title, the
 * first paragraph is a title.
 * We do this to make sure editing can continue after a custom or markup
 * paragraph.
 */
function checkTitleAndLast(
  composition: CompositionType,
  changes: ChangesType
): ChangesType {
  const { elements } = changes
  const rootkeys = Object.keys(elements).filter(
    k => elements[k].path.length === 1
  )
  // Build final children list
  const g: GroupElementType['g'] = Object.assign(
    {},
    composition.g,
    ...rootkeys.map(k => ({
      [k]: elements[k].op === 'delete' ? undefined : elements[k].elem,
    }))
  )
  const ordered = Object.keys(g)
    .filter(k => g[k])
    .sort((a, b) => g[a].p - g[b].p)
  const first = ordered[0]
  const last = ordered[ordered.length - 1]
  const elem = g[last]
  if (!elem || isSpecialElement(elem)) {
    const newId = makeRef()
    const newPara: StringElementType = {
      t: 'P',
      p: elem ? elem.p + 1 : 0,
      i: '',
    }

    if (!elem) {
      const title = getTitleElem(composition)
      if (title) {
        newPara.o = Object.assign({}, title.o)
      }
      changes.selection = caretSelection([newId], 0)
    }

    changes.elements[newId] = {
      op: 'create',
      elem: newPara,
      path: [newId],
      pathId: newId,
    }
  }

  // Make sure we respect title
  const title = getTitleElem(composition)
  if (title) {
    const firstElem = g[first]
    if (!firstElem || isSpecialElement(firstElem)) {
      const secondElem = g[ordered[1]]
      if (firstElem) {
        firstElem.p = secondElem
          ? firstElem.p + (secondElem.p - firstElem.p) / 2
          : 1
      }
      // make an empty title
      const newId = makeRef()
      const newPara: StringElementType = {
        t: 'P',
        p: 0,
        i: '',
        o: { title: true },
      }
      changes.elements[newId] = {
        op: 'create',
        elem: newPara,
        path: [newId],
        pathId: newId,
      }
    } else {
      // Ensure title flag
      firstElem.o = Object.assign({}, title.o)
    }
  }
  return changes
}

export function simplify(
  composition: CompositionType,
  changes: ChangesType
): ChangesType {
  const { elements } = changes
  const updated = filterChanges(elements, ['update', 'create', 'delete'])
  const parents: GroupElementRefTypeById = {}
  updated.forEach(change => {
    const { path } = change
    const id = path[path.length - 1]
    const parentPath = path.slice(0, -1)
    const parentId = parentPath[parentPath.length - 1]
    if (parentId) {
      let refParent: GroupElementRefType = parents[parentId]
      if (!refParent) {
        // Parent not already seen
        const parentRef = elements[parentId]
        const parent = parentRef
          ? parentRef.elem
          : getAtPath(composition, parentPath)
        let parentElem: GroupElementType
        if (!parent) {
          return
        }
        if (isStringElement(parent)) {
          parentElem = { ...parent, g: {} }
          delete parentElem.i
        } else if (isGroupElement(parent)) {
          parentElem = { ...parent, g: Object.assign({}, parent.g) }
        } else {
          throw new Error(`FIXME: custom tag`)
        }
        parents[parentId] = refParent = { elem: parentElem, path: parentPath }
      }
      // We change the parent so that it hold the new/modified children.
      if (change.op === 'delete') {
        delete refParent.elem.g[id]
      } else {
        refParent.elem.g[id] = change.elem
      }
    }
  })

  const makeSelection = changes.selection === undefined

  Object.keys(parents)
    .sort((a, b) => parents[a].elem.p - parents[b].elem.p)
    .forEach(parentId => {
      simplifyParent(changes, parents[parentId], makeSelection)
    })

  checkTitleAndLast(composition, changes)
  return changes
}
