import { runHooks } from '../hooks'
import { Mutation } from '../types'

export function deleteParagraph(m: Mutation, id: string) {
  const { g } = m.comp
  const pos = m.sortedIds.indexOf(id)
  if (pos === 0) {
    // Cannot delete first
    return false
  }
  const elem = g[id]
  if (!elem) {
    return false
  }
  delete g[id]
  runHooks(m, { type: 'deleteParagraph', elem, path: [id] })
  m.sortedIds.splice(pos, 1)
  return true
}
