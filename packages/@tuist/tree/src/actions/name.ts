import { Action } from '../app'
import { TreeType } from '../types'

export interface SetNameArg {
  name: string
  nodeId: string
  tree: TreeType
  done?: boolean
}

export const setName: Action<SetNameArg> = (ctx, arg) => {
  const { done, name, nodeId, tree } = arg
  if (done) {
    tree.selected = { id: nodeId, editName: false }
  }
  tree.blocks[nodeId].name = name
  ctx.actions.tree.changed({ tree })
}
