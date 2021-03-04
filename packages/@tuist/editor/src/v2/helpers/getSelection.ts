import { Mutation, Selection } from '../types'
import { atPath } from './atPath'

export function getSelection(m: Mutation): Selection | undefined {
  const { spath } = m.comp
  if (!spath) {
    return undefined
  }
  const elem = atPath(m, spath.split('.'))
  return (elem && elem.s) || undefined
}
