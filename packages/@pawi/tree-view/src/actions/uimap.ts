import { reference } from '@pawi/build'
import { TreeType } from 'pawi'
import { Action } from '../app'
import { uimap as doMap } from '../helpers'

export const uimap: Action<{ tree: TreeType }> = (ctx, arg) => {
  const { tree } = arg
  const uigraph = doMap(tree)

  // required for drag & drop to find origin from graph id.
  uigraph.tree = reference(arg.tree)
  ctx.state.treeView.uimap[tree.id] = uigraph
}

export const clearUimap: Action<{ tree: TreeType }> = (ctx, arg) => {
  delete ctx.state.treeView.uimap[arg.tree.id]
}
