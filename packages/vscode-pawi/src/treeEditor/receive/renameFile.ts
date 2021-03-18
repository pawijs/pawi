import { Uri, workspace, WorkspaceEdit } from 'vscode'
import { resolvePath } from '../helpers/paths'
import { ReceiveArgument } from '../types'
import { RenameFileMessage } from '../view/types'

export async function renameFile(arg: ReceiveArgument<RenameFileMessage>) {
  const {
    editor: { document },
    msg,
  } = arg

  const oldPath = resolvePath(document.uri.path, msg.oldPath)
  if (!oldPath) {
    // Could happen if document is not in any workspace folder
    return
  }
  const newPath = resolvePath(document.uri.path, msg.newPath)
  if (!newPath) {
    // Could happen if document is not in any workspace folder
    return
  }
  const oldUri = Uri.file(oldPath)
  const newUri = Uri.file(newPath)
  const edit = new WorkspaceEdit()
  edit.renameFile(oldUri, newUri, { ignoreIfExists: true })
  workspace.applyEdit(edit)
}
