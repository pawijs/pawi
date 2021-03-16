import { TreeDefinitions } from '@forten/tree'
import { Source } from '@forten/tree-type'
import { Context } from '../app'
import { visibleName } from '../helpers/paths'
import { BranchContent } from '../types'

export const tree: TreeDefinitions<BranchContent> = {
  pawi: {
    newBlock(arg) {
      if (arg.content) {
        const content = arg.content as Source['content']
        return {
          name: visibleName(content.file),
          content,
        }
      }
      return {
        name: 'new',
        content: { file: '' },
      }
    },
    treeChanged(ctx: Context, arg) {
      ctx.actions.pawi.treeChanged(arg)
    },
    selectBlock(ctx: Context, arg) {
      const node = arg.tree.blocks[arg.id]
      ctx.actions.pawi.send({
        type: 'select',
        path: node.content.file,
      })
    },
    // contentComponent: NodeEditor,
  },
}
