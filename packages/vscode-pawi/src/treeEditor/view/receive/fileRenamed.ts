import { FileRenamedMessage } from '../../../message.types.js'
import { Action } from '../app.js'
import { libraryName, nameFromFile, relativePath } from '../helpers/paths.js'

export const fileRenamed: Action<FileRenamedMessage> = (ctx, arg) => {
  const oldFile = relativePath(ctx.state.treeEditor.dirname, arg.oldPath)
  const newFile = relativePath(ctx.state.treeEditor.dirname, arg.newPath)
  const libBlocks = ctx.state.treeView.library.blocks
  const libBlock = Object.values(libBlocks).find(
    block => block.content.file === oldFile
  )
  if (libBlock) {
    libBlock.name = libraryName(newFile)
    libBlock.content.file = newFile
  } else {
    console.log('ERROR could not find', oldFile)
  }
  const { tree } = ctx.state.treeEditor
  if (tree) {
    let changed = false
    for (const block of Object.values(tree.blocks)) {
      if (block.content.file === oldFile) {
        changed = true
        block.name = nameFromFile(newFile)
        block.content.file = newFile
      }
    }
    if (changed) {
      ctx.actions.tree.changed({ tree })
    }
  }
}
