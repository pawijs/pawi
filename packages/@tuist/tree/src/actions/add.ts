import { TreeType } from 'tuist'
import { Action } from '../app'
import { newTree } from '../helpers'
import { appendGraph } from '../helpers/appendGraph'

export interface FullAddArg {
  slotIdx: number
  parentId: string
  tree: TreeType
}

export interface AddArg {
  slotIdx?: number
  parentId?: string
  content?: any
  tree: TreeType
}

function defaultSlot(arg: AddArg): FullAddArg {
  if (arg.parentId && arg.slotIdx !== undefined) {
    return arg as FullAddArg
  }
  const { blocks, entry } = arg.tree
  let parentId = entry
  let block = blocks[parentId]
  while (block.children[0]) {
    parentId = block.children[0]
    block = blocks[parentId]
  }
  return { ...arg, parentId, slotIdx: 0 }
}

export const add: Action<AddArg> = (ctx, arg) => {
  const { tree, parentId, slotIdx } = defaultSlot(arg)
  const type = tree.type
  const def = ctx.state.tree.definitions()[type]
  if (!def) {
    throw new Error(
      `Cannot add new node to tree type '${type}' (missing definition).`
    )
  }
  const blockDefinition = def.newBlock(ctx, arg)
  const newId = appendGraph(
    tree,
    parentId,
    slotIdx,
    newTree(tree.type, blockDefinition)
  )
  tree.selected = { id: newId, editName: true }
  ctx.actions.tree.changed({ tree })
}
