import { Element, GroupElement, Mutation } from '../types'

/* Return an array with position at each level in path.
 */
export function position(m: Mutation, path: string[]): number[] {
  let c: Element = m.comp as GroupElement
  return path.map(ref => {
    c = c.g![ref]
    return c.p
  })
}
