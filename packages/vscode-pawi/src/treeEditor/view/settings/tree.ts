import { TreeDefinitions } from '@forten/tree'
import { Source, TreeType } from '@forten/tree-type'
import { Context } from '../app.js'
import { BlockEditor } from '../components/index.js'
import { newBasicBlock } from '../helpers/newBlock.js'
import { nameFromFile } from '../helpers/paths.js'
import { BranchContent } from '../types.js'

// find the shortest path to a block ending in 'default'
function findDefaultFile(tree: TreeType) {
  let path: string | undefined
  for (const block of Object.values(tree.blocks)) {
    if (block.name.endsWith('default')) {
      if (!path || block.content.file.length < path) {
        path = block.content.file
      }
    }
  }
  return path
}

export const tree: TreeDefinitions<BranchContent> = {
  pawi: {
    newBlock(ctx: Context, arg) {
      if (arg.content) {
        const content = arg.content as Source['content']
        return {
          name: nameFromFile(content.file),
          content,
        }
      } else {
        const basicBlock = newBasicBlock(ctx)
        const fromPath = findDefaultFile(ctx.state.treeView.library)
        ctx.actions.treeEditor.send({
          type: 'createFile',
          path: basicBlock.content.file,
          fromPath,
        })
        return basicBlock
      }
    },
    nameChanged(ctx: Context, { tree, blockId, previousName }) {
      const block = tree.blocks[blockId]
      const file: string = block.content.file
      if (file.endsWith(`${previousName}.o.js`)) {
        // rename file
        const newPath =
          file.slice(0, -previousName.length - 5) + `${block.name}.o.js`

        block.content.file = newPath
        ctx.actions.treeEditor.send({
          type: 'renameFile',
          oldPath: file,
          newPath,
        })
      }
    },
    treeChanged(ctx: Context, arg) {
      ctx.actions.treeEditor.treeChanged(arg)
    },
    selectBlock(ctx: Context, arg) {
      const node = arg.tree.blocks[arg.id]
      ctx.actions.treeEditor.send({
        type: 'openFile',
        path: node.content.file,
        focus: !!arg.editContent,
      })
    },
    contentComponent: BlockEditor,
  },
}
