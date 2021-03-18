import { FileCreatedMessage } from '../../../message.types.js'
import { Action } from '../app.js'
import { addLibrayBlock } from '../helpers/makeLibrary.js'
import { relativePath } from '../helpers/paths.js'

export const fileCreated: Action<FileCreatedMessage> = (ctx, arg) => {
  const { path } = arg
  addLibrayBlock(
    ctx.state.treeView.library,
    relativePath(ctx.state.treeEditor.dirname, path)
  )
}
