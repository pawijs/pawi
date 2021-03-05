import { BranchDefinition } from 'tuist'
import { makeId } from './makeId'

interface GrabResult {
  trunc: BranchDefinition
  cut?: BranchDefinition
  parentId?: string
  slotIdx?: number
}

function grabBlocks(
  branch: BranchDefinition,
  id: string,
  split: string | undefined,
  blocks: BranchDefinition['blocks']
): GrabResult {
  const block = branch.blocks[id]
  let result: GrabResult = { trunc: branch }
  const children: (string | null)[] = []
  block.children.forEach((childId, idx) => {
    if (childId === null) {
      children.push(null)
      return
    }
    if (childId === split) {
      const id = makeId(branch.blocks)
      const cut: BranchDefinition = {
        id,
        version: id,
        type: branch.type,
        entry: split,
        blocks: {},
      }
      const trunc: BranchDefinition = {
        id: branch.id,
        type: branch.type,
        version: makeId({ [branch.version]: '' }),
        entry: branch.entry,
        blocks,
      }

      grabBlocks(branch, childId, undefined, cut.blocks)
      result = { trunc, cut, slotIdx: idx, parentId: block.id }
      if (idx !== block.children.length - 1) {
        children.push(null)
      }
    } else {
      const res = grabBlocks(branch, childId, split, blocks)
      children.push(childId)
      if (res.cut) {
        result = res
      }
    }
  })
  blocks[id] = { ...block, children }
  return result
}

export function cutBranch(
  branch: BranchDefinition,
  nodeId: string
): GrabResult {
  if (nodeId === branch.entry) {
    // Just make a copy
    const id = makeId(branch.blocks)
    const cut: BranchDefinition = Object.assign(
      JSON.parse(JSON.stringify(branch)) as BranchDefinition,
      {
        id,
        version: id,
        entry: id,
      }
    )
    const entry = cut.blocks[branch.entry]
    delete cut.blocks[branch.entry]
    entry.id = id
    cut.blocks[id] = entry
    return {
      trunc: JSON.parse(JSON.stringify(branch)),
      cut,
    }
  }
  return grabBlocks(branch, branch.entry, nodeId, {})
}
