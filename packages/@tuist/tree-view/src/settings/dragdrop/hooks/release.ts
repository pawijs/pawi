import { Context } from '../../../app'
import { DragdropHooks } from '@tuist/dragdrop'
import { TreeDrag } from '../../../types'
import { makeId } from '@tuist/tree'
import { resolve } from '@tuist/build'

export const release: DragdropHooks['release'] = (ctx: Context) => {
  const { actions, state } = ctx
  const { drag, drop } = state.dragdrop
  if (!drag) {
    return
  }

  const { origin, tree } = drag.payload as TreeDrag
  actions.treeView.clearUimap({ tree })

  if (!drop) {
    // cleanup only needed if drop is not triggered
    // clear cached uimap
    const originTree = resolve(ctx, origin)
    if (originTree && originTree.lock) {
      delete originTree.lock
      originTree.version = makeId({ [originTree.version]: '' })
      actions.treeView.uimap({ tree: originTree })
    }
  }
}
