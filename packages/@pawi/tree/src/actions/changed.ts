import { TreeType } from 'pawi'
import { Action } from '../app'
import { makeId } from '../helpers'
import { TreeConnectArg } from '../types'

export interface TreeChangedArg {
  tree: TreeType
  connecting?: TreeConnectArg
}

export const changed: Action<TreeChangedArg> = (ctx, arg) => {
  const { state } = ctx
  const { tree } = arg
  if (!arg.connecting) {
    // Only re-render on true drop
    tree.version = makeId({ [tree.version]: '' })
  }

  // callback on tree change
  const definition = state.tree.definitions()[tree.type]
  if (definition) {
    definition.treeChanged.forEach(fun => fun(ctx, arg))
  }
}
