import { CompositionType, ElementType, GroupElementType, isGroupElement, PathType } from './types'

/* Return an array with position at each level in path.
*/
export function getPosition(
  composition: CompositionType,
  path: PathType
): number[] {
  let currentElement: ElementType = composition as GroupElementType
  return path.map(ref => {
    if (isGroupElement(currentElement)) {
      currentElement = currentElement.g[ref]
      if (!currentElement) {
        throw new Error(
          `Invalid path '${path.join('.')}' (could not find '${ref}').`
        )
      }
      return currentElement.p
    } else {
      throw new Error(
        `Invalid path '${path.join('.')}' ('${ref}' parent is not a group.`
      )
    }
  })
}
