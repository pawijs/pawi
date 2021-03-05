import { TreeType } from 'tuist'
import { Action } from '../app'

export interface ContentChangedArg {
  tree: TreeType
  nodeId: string
  previousContent: any
}

export const contentChanged: Action<ContentChangedArg> = (ctx, arg) => {
  const { state } = ctx
  const { tree } = arg

  // callback on content change
  const definition = state.tree.definitions()[tree.type]
  if (definition) {
    definition.contentChanged.forEach(fun => fun(ctx, arg))
  }
}
