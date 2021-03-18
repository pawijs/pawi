import { LibraryMessage } from '../../../message.types.js'
import { Action } from '../app'
import { makeLibrary } from '../helpers/makeLibrary'

export const library: Action<LibraryMessage> = (ctx, arg) => {
  const { dirname } = ctx.state.treeEditor
  ctx.state.treeView.library = makeLibrary(dirname, arg.paths)
}
