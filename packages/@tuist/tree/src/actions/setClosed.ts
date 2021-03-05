import { TreeType } from 'tuist'
import { Action } from '../app'

export interface SetClosedArg {
  nodeId: string
  tree: TreeType
  closed: boolean
}

export const setClosed: Action<SetClosedArg> = (ctx, arg) => {
  const { closed, nodeId, tree } = arg
  tree.blocks[nodeId].closed = closed
  ctx.actions.tree.changed({ tree })
}
