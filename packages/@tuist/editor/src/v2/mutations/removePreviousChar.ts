import { Mutation, StringElement, isStringElement } from '../types'
import { atPath, caretSelection, split } from '../helpers'

import { closest } from '../helpers/closest'
import { isGroupElement } from '../../lib'
import { setSelection } from '.'
import { simplify } from '../operations'

export function removePreviousChar(m: Mutation, elem: StringElement) {
  const s = elem.s
  if (!s) {
    return false
  }
  const { anchorPath, anchorOffset } = s
  if (anchorOffset > 0) {
    const [a, finish] = split(elem.i, anchorOffset)
    // Convert to array of characters (because emoji and multi byte characters)
    const ar = Array.from(a)
    // Remove last char
    const start = ar.slice(0, ar.length - 1).join('')
    elem.i = start + finish
    s.anchorOffset = start.length
    if (s.anchorOffset === 0) {
      // Select at end of previous neighbour: rule (1)
      const prev = closest(m, s.anchorPath, 'up')
      if (!prev) {
        // Zero selection accepted in first descendant of paragraph: rule (3)
      } else if (isStringElement(prev.elem)) {
        setSelection(m, caretSelection(prev.path, prev.elem.i.length))
      }
      if (elem.i.length === 0) {
        // Apply rule (2)
        const id = anchorPath.slice(-1)[0]
        if (anchorPath.length > 1) {
          // Remove element
          const parent = atPath(m, anchorPath.slice(0, -1))
          if (parent && isGroupElement(parent)) {
            delete parent.g[id]
            const sh = {}
            simplify(m, sh, anchorPath[0])
          }
        } else {
          // Allow empty paragraph
        }
      }
    }
    return true
  } else {
    return false
  }
}
