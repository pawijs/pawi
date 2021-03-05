import { BlockDefinition, TreeType } from 'tuist'
import { makeId } from './makeId'

interface IdMap {
  [oldId: string]: string
}

function remap(blocks: TreeType['blocks'], map: IdMap, id: string): string {
  const newId = blocks[id] ? makeId(blocks) : id
  return (map[id] = newId)
}

/** Append a graph in place. */
/* FIXM: test duplicate id in branch and tree. */
export function appendGraph(
  tree: TreeType,
  nodeId: string,
  slotIdx: number,
  branch: TreeType
): string {
  const node = tree.blocks[nodeId]
  if (!node) {
    throw new Error(`Cannot append (nodeId '${nodeId}' not in tree).`)
  }
  const map: IdMap = {}
  const { children } = node
  for (let i = 0; i < slotIdx; ++i) {
    if (typeof children[i] !== 'string') {
      children[i] = null
    }
  }
  const newId = insertBlock(tree.blocks, branch.blocks, map, branch.entry)
  children[slotIdx] = newId
  return newId
}

function insertBlock(
  target: TreeType['blocks'],
  source: TreeType['blocks'],
  map: IdMap,
  id: string
): string {
  const block: BlockDefinition = JSON.parse(JSON.stringify(source[id]))
  block.id = remap(target, map, id)
  block.children = block.children.map(id =>
    id ? insertBlock(target, source, map, id) : null
  )
  target[block.id] = block
  return block.id
}
