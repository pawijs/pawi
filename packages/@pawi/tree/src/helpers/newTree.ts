import { TreeType } from 'pawi'
import { newBlock } from './newBlock'

export function newTree<T>(
  type: string,
  rootElement: { content: T; name: string }
): TreeType<T> {
  const block = newBlock(rootElement)
  const { id } = block
  const tree: TreeType = {
    type,
    id: id,
    version: id,
    entry: id,
    blocks: { [id]: block },
  }
  return tree
}
