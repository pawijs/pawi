import { rangeSelection } from '../helpers'
import { closest } from '../helpers/closest'
import { removeRange } from '../operations'
import { isStringElement, Mutation } from '../types'

export function collapseUp(m: Mutation, path: string[]) {
  const prev = closest(m, path, 'up', true)
  if (!prev || !isStringElement(prev.elem)) {
    return false
  }
  return removeRange(m, rangeSelection(prev.path, prev.elem.i.length, path, 0))
}
