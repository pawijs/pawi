import { CompositionType, ElementType, isGroupElement } from './types'

/* Returns the element at the given path
*/
export function getAtPath(
  composition: CompositionType,
  path: string[],
  allowMissing: boolean = false
): ElementType | undefined {
  const elem = path.reduce(
    (current, key) => {
      if (current && isGroupElement(current)) {
        return current.g[key]
      } else {
        return undefined
      }
    },
    composition as ElementType | undefined
  )
  if (!elem && !allowMissing) {
    console.log(composition)
    throw new Error(`No element at path '${path.join('.')}'.`)
  }
  return elem
}
