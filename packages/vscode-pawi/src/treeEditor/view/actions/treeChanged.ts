import { unproxy } from '@forten/build'
import { appendGraph } from '@forten/tree'
import { TreeChangedArg } from '@forten/tree/dist/actions'
import { Action } from '../app'

// Disable live preview until we have better hot reloading to avoid glitches.
const livePreview = false

export const treeChanged: Action<TreeChangedArg> = (ctx, arg) => {
  if (arg.tree.id !== ctx.state.treeEditor.tree?.id) {
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
      ctx.actions.pawi.send({
        type: 'update',
        path: ctx.state.treeEditor.path,
        text: JSON.stringify(newTree, null, 2),
      })
    }
  } else if (arg.tree.id === ctx.state.treeEditor.tree?.id) {
    // Send to vscode
    ctx.actions.pawi.send({
      type: 'update',
      path: ctx.state.treeEditor.path,
      text: JSON.stringify(ctx.state.treeEditor.tree, null, 2),
    })
  }
}
