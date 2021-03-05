import { TreeDefinitions } from '@tuist/tree'
import { Context } from '../app'
import { BranchContent } from '../types'

export const tree: TreeDefinitions<BranchContent> = {
  tuist: {
    newBlock() {
      return {
        name: 'new',
        content: { file: '' },
      }
    },
    treeChanged(ctx: Context) {
      ctx.actions.tuist.treeChanged()
    },
    selectNode(ctx: Context, arg) {
      const node = arg.tree.blocks[arg.id]
      ctx.actions.tuist.send({
        type: 'select',
        path: node.content.file,
      })
    },
    // contentComponent: NodeEditor,
  },
}
