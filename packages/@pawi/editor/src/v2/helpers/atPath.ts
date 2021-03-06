import { Element, isGroupElement, Mutation } from '../types'

/* Returns the element at the given path
 */
export function atPath(
  { comp }: Mutation,
  path: string[]
): Element | undefined {
  const elem = path.reduce((current, key) => {
    if (current && isGroupElement(current)) {
      return current.g[key]
    } else {
      return undefined
    }
  }, comp as Element | undefined)
  return elem
}
