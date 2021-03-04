import { getSelection } from '../helpers'
import { removeRange, applyStyle } from '../operations'
import { isRangeSelection, Mutation } from '../types'

export function lineBreak(m: Mutation) {
  const selection = getSelection(m)
  if (!selection) {
    return false
  }
  if (isRangeSelection(selection)) {
    removeRange(m, selection)
  }
  return applyStyle(m, 'E')
}
