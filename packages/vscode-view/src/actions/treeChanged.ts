import { unproxy } from '@tuist/build'
import { appendGraph } from '@tuist/tree'
import { TreeChangedArg } from '@tuist/tree/dist/actions'
import { Action } from '../app'

// Disable live preview until we have better hot reloading to avoid glitches.
const livePreview = false

export const treeChanged: Action<TreeChangedArg> = (ctx, arg) => {
  if (arg.tree.id !== ctx.state.tuist.tree?.id) {
    // Only watch changes on main tree
    return
  }
  const { connecting } = arg
  if (connecting) {
    if (livePreview) {
      // Live connect preview
      const tree = arg.tree
      const newTree = unproxy(tree)
      appendGraph(
        newTree,
        connecting.nodeId,
        connecting.slotIdx,
        connecting.tree
      )
      // Send to vscode
      ctx.actions.tuist.send({
        type: 'update',
        path: ctx.state.tuist.path,
        text: JSON.stringify(newTree, null, 2),
      })
    }
  } else if (arg.tree.id === ctx.state.tuist.tree?.id) {
    // Send to vscode
    ctx.actions.tuist.send({
      type: 'update',
      path: ctx.state.tuist.path,
      text: JSON.stringify(ctx.state.tuist.tree, null, 2),
    })
  }
}
