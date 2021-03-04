import { anchorElement } from '../helpers'
import { runHooks } from '../hooks'
import { Mutation } from '../types'

export function clearSelection(m: Mutation) {
  const { comp } = m
  const { spath } = comp
  if (!spath) {
    return false
  }
  const ref = anchorElement(m)
  if (ref && ref.elem.s) {
    delete ref.elem.s
    runHooks(m, { type: 'clearSelection', ...ref })
  }
  delete comp.spath
  return true
}
