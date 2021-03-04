import { SelectionType } from '../../lib'
import { getPath } from './getPath'

export function getSelection(compId: string): SelectionType | undefined {
  const selection = window.getSelection()
  if (!selection) {
    return
  }
  const { anchorNode, focusNode, focusOffset } = selection
  if (!anchorNode) {
    return
  }
  const anchor = (anchorNode.nodeType === Node.TEXT_NODE
    ? anchorNode.parentElement
    : anchorNode) as HTMLElement
  // We do this to make sure Caret is inserted at the start of blank
  // paragraphs so that deleting an empty paragraph takes a single
  // consistent backspace #97. When we insert first letter, the classList is still 'Empty', hence the test for the zero width char.
  const anchorOffset =
    anchor.classList.contains('Empty') &&
    anchor.innerText.charCodeAt(0) === 8203
      ? 0
      : selection.anchorOffset

  let { type } = selection
  if (!anchorNode) {
    return
  }
  const anchorPath = getPath(compId, anchor)
  if (!anchorPath) {
    // Selection is not in our composition
    return
  } else if (!anchorPath.length) {
    // Selected Composition itself. Unselect:
    const selector = window.getSelection()
    if (selector) {
      selector.removeAllRanges()
    }
    return
  }
  if (!focusNode) {
    // Should not happen as we checked type
    return
  }
  const focus = (focusNode.nodeType === Node.TEXT_NODE
    ? focusNode.parentElement
    : focusNode) as HTMLElement
  const focusPath =
    focusNode === anchorNode ? anchorPath : getPath(compId, focus)
  if (!focusPath) {
    // Should never happen as we checked for anchorPath
    return
  }

  if (focusPath.length === 0) {
    // Bug on double-click
    type = 'Caret'
  }
  const anchorValue = anchorNode.textContent!
  const focusValue = focusNode.textContent!
  const rects = selection.getRangeAt(0).getClientRects()

  const last = rects.length
    ? rects[rects.length - 1]
    : anchor.getClientRects()[0]

  if (!last) {
    return
  }

  if (type === 'Caret') {
    return {
      type: 'Caret',
      anchorPath,
      anchorOffset,
      anchorValue,
      position: {
        top: last.top,
        left: last.left + last.width,
      },
    }
  }

  const first = rects[0]
  if (!first) {
    // no selection
    return
  }

  let end
  if (
    first.top > last.top ||
    (first.top === last.top && first.left > last.left)
  ) {
    end = {
      top: first.top,
      left: first.left + first.width,
    }
  } else {
    end = {
      top: last.top,
      left: last.left + last.width,
    }
  }

  if (
    anchorNode.compareDocumentPosition(focusNode) &
    Node.DOCUMENT_POSITION_PRECEDING
  ) {
    // reverse
    return {
      type: 'Range',
      anchorOffset: focusOffset,
      focusOffset: anchorOffset,
      anchorPath: focusPath,
      focusPath: anchorPath,
      anchorValue: focusValue,
      position: end,
    }
  } else {
    return {
      type: 'Range',
      anchorOffset,
      focusOffset,
      anchorPath,
      focusPath,
      anchorValue,
      position: end,
    }
  }
}
