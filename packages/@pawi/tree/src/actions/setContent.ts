import { TreeType } from 'pawi'
import { Action } from '../app'

export interface SetContentArg {
  nodeId: string
  tree: TreeType
  // FIXME: how to make this generic ?
  content: any
}

export const setContent: Action<SetContentArg> = (ctx, arg) => {
  const { content, nodeId, tree } = arg
  const previousContent = tree.blocks[nodeId].content
  tree.blocks[nodeId].content = content
  ctx.actions.tree.contentChanged({ tree, nodeId, previousContent })
}
