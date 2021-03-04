import { Context } from '../../../app'
import { DragdropHooks } from '@tuist/dragdrop'
import { TreeDrag } from '../../../types'
import { cutBranch } from '@tuist/tree'
import { resolve } from '@tuist/build'

export const start: DragdropHooks['start'] = (ctx: Context) => {
  const { state } = ctx
  const { drag } = state.dragdrop
  if (!drag) {
    return
  }
  const payload = drag.payload as TreeDrag
  const origin = resolve(ctx, payload.origin)
  if (!origin) {
    return
  }
  // Create a sub-tree
  const { trunc, cut, slotIdx, parentId } = cutBranch(origin, payload.nodeId)
  if (!cut) {
    throw new Error(
      `Invalid operation, cannot cut tree at nodeId '${payload.nodeId}'.`
    )
  }
  // Change original graph in place.
  const uigraph = ctx.state.treeView.uimap[origin.id]
  delete origin.lock
  delete origin.selected

  Object.assign(origin, trunc)
  if (parentId && slotIdx !== undefined) {
    const uinode = uigraph.uiNodeById[payload.nodeId]
    if (uinode) {
      origin.lock = { parentId, slotIdx, width: uinode.size.w }
    }
  }

  // Change grabbed part
  payload.tree = cut
  // We pass 'payload.tree' because uimap expects the proxy value.
  ctx.actions.treeView.uimap({ tree: payload.tree })
  ctx.actions.treeView.uimap({ tree: origin })
}
