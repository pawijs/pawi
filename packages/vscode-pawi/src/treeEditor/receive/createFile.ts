import { readFileSync } from 'fs'
import { Position, Uri, workspace, WorkspaceEdit } from 'vscode'
import { resolvePath } from '../../helpers/paths'
import { ReceiveArgument } from '../types'
import { CreateFileMessage } from '../view/types'
import { openFile } from './openFile'

export async function createFile(arg: ReceiveArgument<CreateFileMessage>) {
  const {
    editor: { document },
    msg: { path, fromPath },
  } = arg
  const filePath = resolvePath(document.uri.path, path)
  if (!filePath) {
    return
  }
  const uri = Uri.file(filePath)
  const edit = new WorkspaceEdit()
  let content = ''
  if (fromPath) {
    const file = resolvePath(document.uri.path, fromPath)
    if (file) {
      content = readFileSync(file, 'utf-8')
    }
  }
  edit.createFile(uri, { ignoreIfExists: true })
  edit.insert(uri, new Position(0, 0), content)
  workspace.applyEdit(edit).then(() => {
    document.save()
    const doc = workspace.openTextDocument(uri)
    doc.then(d => d.save())

    openFile({
      editor: arg.editor,
      panel: arg.panel,
      msg: {
        type: 'openFile',
        path,
        focus: true,
      },
    })
  })
}
