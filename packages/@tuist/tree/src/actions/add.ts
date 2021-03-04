import { Action } from '../app'
import { newTree } from '../helpers'
import { appendGraph } from '../helpers/appendGraph'
import { TreeType } from '../types'

export interface AddArg {
  slotIdx: number
  parentId: string
  tree: TreeType
}

export const add: Action<AddArg> = (ctx, arg) => {
  const { tree, parentId, slotIdx } = arg
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
