import { endCaretSelection, siblings } from '../helpers'
import { deleteParagraph as del, setSelection } from '../operations'
import { Mutation } from '../types'

export function deleteParagraph(m: Mutation, id: string) {
  if (del(m, id)) {
    const [prev] = siblings(m.comp, [], id, m.sortedIds)
    if (!prev) {
      return false
    }
    setSelection(m, endCaretSelection(prev!))
    return true
  }
  return false
}
