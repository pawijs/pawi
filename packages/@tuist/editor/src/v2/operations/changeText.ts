import { anchorElement } from '../helpers'
import { isStringElement, Mutation } from '../types'

export function changeText(m: Mutation, i: string) {
  const e = anchorElement(m)
  if (!e || !isStringElement(e.elem)) {
    return false
  }
  e.elem.i = i
  return true
}
