import { ElementType, isStringElement, StringElementType } from './types'

interface TextBlocks {
  [key: string]: boolean
}

const TEXT_BLOCKS: TextBlocks = {
  H: true,
  P: true,
  T: true,
  B: true,
  I: true,
  ['B+I']: true,
  E: false,
}

/** Return true if the current element is a text block.
 * TODO: What is this ? Why don't we simply use isStringElement ?
 */
export function isTextBlock(elem: ElementType): elem is StringElementType {
  return (TEXT_BLOCKS[elem.t] && isStringElement(elem)) || false
}
