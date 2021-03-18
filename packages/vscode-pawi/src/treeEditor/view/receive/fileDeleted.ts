import { FileDeletedMessage } from '../../../message.types.js'
import { Action } from '../app.js'
import { relativePath } from '../helpers/paths.js'

export const fileDeleted: Action<FileDeletedMessage> = (ctx, arg) => {
  const file = relativePath(ctx.state.treeEditor.dirname, arg.path)
  const blocks = ctx.state.treeView.library.blocks
  const block = Object.values(blocks).find(block => block.content.file === file)
  if (block) {
    delete blocks[block.id]
  } else {
    console.log('ERROR could not find', file)
  }
}
