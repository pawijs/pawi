import { getSelection } from '../helpers'
import { removeRange, setSelection, splitParagraph } from '../operations'
import { isRangeSelection, Mutation } from '../types'

export function newParagraph(m: Mutation) {
  const selection = getSelection(m)
  if (!selection) {
    return false
  }
  if (isRangeSelection(selection)) {
    removeRange(m, selection)
  }
  const ns = splitParagraph(m, selection)
  return ns && setSelection(m, ns)
}
