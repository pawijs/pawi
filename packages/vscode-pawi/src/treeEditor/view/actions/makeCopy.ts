import { TreeType } from '@forten/tree-type'
import { Action } from '../app.js'
import { newBasicBlock } from '../helpers/newBlock.js'

export interface MakeCopyArg {
  tree: TreeType
  blockId: string
}

export const makeCopy: Action<MakeCopyArg> = (ctx, arg) => {
  const { tree, blockId } = arg
  const block = tree.blocks[blockId]
  const { content, name } = newBasicBlock(ctx, block.name)
  ctx.actions.treeEditor.send({
    type: 'createFile',
    path: content.file,
    fromPath: block.content.file,
  })
  // We do not call 'setName' here to avoid making it look like
  // a simple name change (which would do a file rename operation)
  block.name = name
  ctx.actions.tree.setContent({
    tree,
    blockId,
    content,
  })
}
