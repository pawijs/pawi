import { SelectionType } from '../../lib'
import { getSelection } from './getSelection'
import { isRangeSelection } from '../../lib/utils/types'

export function getTextNode(node: Element): ChildNode | undefined {
  for (let i = 0; i < node.childNodes.length; i++) {
    let child = node.childNodes[i]
    if (child.nodeType === Node.TEXT_NODE) {
      return child
    }
  }
  return undefined
}

export function setSelection(
  compId: string,
  node: HTMLElement,
  selection: SelectionType,
  ignoreOffset: boolean = false
) {
  if (node) {
    const oldSelection = getSelection(compId)
    if (oldSelection && sameSelection(oldSelection, selection)) {
      // Avoid messing with Browser selection as much as possible.
      return
    }
    const textNode = getTextNode(node)
    if (!textNode) {
      // This is a bug...
      console.error(
        `BUG: Cannot set selection: missing textNode in start node.`
      )
      console.error(node)
      return
    }
    const range = document.createRange()
    range.setStart(
      textNode,
      ignoreOffset
        ? 0
        : // Make sure the selection is valid with the current node state.
          Math.min(
            selection.anchorOffset,
            textNode.textContent ? textNode.textContent.length : 0
          )
    )
    if (selection.type === 'Range') {
      const focus = selection.focusPath[selection.focusPath.length - 1]
      const el = document.querySelector(`[data-ref="${focus}"]`)
      if (!el) {
        // FIXME: This should not happen if the selection is correctly updated on element suppression...
        console.log(`Cannot find selection end element '${focus}'.`)
      } else {
        const endNode = getTextNode(el)
        if (!endNode) {
          // This is a bug...
          console.error(`Cannot set selection: missing textNode in end node.`)
          console.error(node)
          return
        }
        range.setEnd(
          endNode,
          // Make sure the selection is valid with the current node state.
          Math.min(
            selection.focusOffset,
            endNode.textContent ? endNode.textContent.length : 0
          )
        )
      }
    }

    const selector = window.getSelection()
    if (!selector) {
      // No idea when this can happen but let's be safe
      return
    }

    selector.removeAllRanges()
    selector.addRange(range)
  }
}

export function sameSelection(a: SelectionType, b: SelectionType): boolean {
  return (
    a.anchorOffset === b.anchorOffset &&
    a.anchorPath.join('.') === b.anchorPath.join('.') &&
    isRangeSelection(a) &&
    isRangeSelection(b) &&
    a.focusOffset === b.focusOffset &&
    a.focusPath.join('.') === b.focusPath.join('.')
  )
}
