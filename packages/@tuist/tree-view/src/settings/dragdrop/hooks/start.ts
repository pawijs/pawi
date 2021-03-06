import { reference, resolve } from '@tuist/build'
import { DragdropHooks } from '@tuist/dragdrop'
import { cutBranch, newTree } from '@tuist/tree'
import { Context } from '../../../app'
import { LibraryDrag, TreeDrag } from '../../../types'

export const start: DragdropHooks['start'] = (ctx: Context) => {
  const { state } = ctx
  const { drag } = state.dragdrop
  if (!drag) {
    return
  }
  if (drag.payload.block) {
    const payload = drag.payload as LibraryDrag
    const tree = newTree('tuist', payload.block)
    ctx.state.treeView.libraryTree = tree
    const newPayload: TreeDrag = {
      origin: reference(ctx.state.treeView.libraryTree),
      tree,
      nodeId: tree.entry,
    }
    console.log('>>>>', newPayload)
    drag.payload = newPayload
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
