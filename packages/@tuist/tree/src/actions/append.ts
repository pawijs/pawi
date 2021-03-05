import { Reference, resolve } from '@tuist/build'
import { TreeType } from 'tuist'
import { Action } from '../app'
import { appendGraph, makeId } from '../helpers'

export interface AppendArg {
  // Thing to append
  // A reference to the original graph (where the drag operation started for example).
  origin: Reference<TreeType>
  // The branch to append
  tree: TreeType

  // Target
  target: Reference<TreeType>
  nodeId: string
  slotIdx: number
}

export const append: Action<AppendArg> = (ctx, arg) => {
  const origin = resolve(ctx, arg.origin)
  if (origin && origin.lock) {
    delete origin.lock
    origin.version = makeId({ [origin.version]: '' })
  }

  const target = resolve(ctx, arg.target)
  if (!target) {
    return
  }
  if (origin && origin.id !== target.id) {
    // Removed lock, run change
    ctx.actions.tree.changed({ tree: origin })
  }

  const { tree, nodeId, slotIdx } = arg
  appendGraph(target, nodeId, slotIdx, tree)
  ctx.actions.tree.changed({ tree: target })
}
