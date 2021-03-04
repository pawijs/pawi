import { TreeDrag, TreeDrop } from '../types'

import { Action } from '../app'
import { resolve } from '@tuist/build'

export type DropArg = TreeDrag & TreeDrop

export const drop: Action<DropArg> = (ctx, arg) => {
  const target = resolve(ctx, arg.target)
  if (!target) {
    return
  }

  const slotTarget = ctx.state.treeView.dropTarget[target.id]
  if (!slotTarget) {
    return
  }
  delete ctx.state.treeView.dropTarget[target.id]

  ctx.actions.tree.append(Object.assign({}, arg, slotTarget))
}
