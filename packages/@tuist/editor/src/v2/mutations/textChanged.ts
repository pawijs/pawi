import { getSelection } from '../helpers'
import { changeText, removeRange, setSelection } from '../operations'
import { isRangeSelection, Mutation, Selection } from '../types'

export function textChanged(
  m: Mutation,
  { i, s }: { i: string; s: Selection }
) {
  const selection = getSelection(m)
  if (selection && isRangeSelection(selection)) {
    removeRange(m, selection)
  }
  changeText(m, i)
  setSelection(m, s)
  return true
}
