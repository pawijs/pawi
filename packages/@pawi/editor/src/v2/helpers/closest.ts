import { ElementRef, Mutation } from '../types'
import { atPath } from './atPath'
import { firstDescendant, lastDescendant } from './children'
import { siblings } from './siblings'

// Return closest neighbour: the element right after or before that
// is displayed in the document. A neighbour can be a sibling
// (same parent) or a cousin.
export function closest(
  m: Mutation,
  path: string[],
  dir: 'up' | 'down',
  accrossParagraphs: boolean = false
): ElementRef | undefined {
  const id = path.slice(-1)[0]
  const basepath = path.slice(0, -1)
  if (!basepath.length && !accrossParagraphs) {
    return undefined
  }
  const parent = basepath.length ? atPath(m, basepath) : m.comp
  const g = parent && parent.g
  if (!g) {
    // This should never happen
    return undefined
  }
  const sibling = siblings({ g }, basepath, id)[dir === 'up' ? 0 : 1]
  if (!sibling) {
    // nothing before at this level, move less deep
    return closest(m, basepath, dir)
  } else {
    return dir === 'up' ? lastDescendant(sibling) : firstDescendant(sibling)
  }
}
