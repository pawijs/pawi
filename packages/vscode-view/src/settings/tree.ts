import { TreeDefinitions } from '@tuist/tree'
import { Source } from 'tuist'
import { Context } from '../app'
import { getName } from '../helpers/paths'
import { BranchContent } from '../types'

export const tree: TreeDefinitions<BranchContent> = {
  tuist: {
    newBlock(arg) {
      if (arg.content) {
        const content = arg.content as Source['content']
        return {
          name: getName(content.file),
          content,
        }
      }
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
