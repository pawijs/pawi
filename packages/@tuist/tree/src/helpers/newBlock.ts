import { BlockDefinition, TreeType } from 'tuist'
import { makeId } from './makeId'

export function newBlock(
  definition: { content: any; name: string },
  blocks: TreeType['blocks'] = {}
): BlockDefinition {
  const block: BlockDefinition = {
    id: makeId(blocks),
    children: [],
    ...definition,
  }
  return block
}
