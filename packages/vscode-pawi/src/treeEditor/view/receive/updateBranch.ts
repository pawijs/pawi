import { TreeType } from '@forten/tree-type'
import { UpdateBranchMessage } from '../../../message.types.js'
import { Action } from '../app'

export const updateBranch: Action<UpdateBranchMessage> = (ctx, arg) => {
  const tree = JSON.parse(arg.branch) as TreeType
  if (tree.version === ctx.state.treeEditor.tree?.version) {
    return
  }
  ctx.state.treeEditor.tree = tree
  ctx.state.treeEditor.path = arg.path
  ctx.state.treeEditor.dirname = arg.path.split('/').slice(0, -1).join('/')
}
