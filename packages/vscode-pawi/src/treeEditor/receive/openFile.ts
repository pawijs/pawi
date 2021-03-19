import { commands, Uri, ViewColumn, window, workspace } from 'vscode'
import { resolvePath } from '../../helpers/paths'
import { ReceiveArgument, TREE_EDITOR_VIEW_TYPE } from '../types'
import { OpenFileMessage } from '../view/types'

export async function openFile({
  editor: { document },
  panel: { viewColumn },
  msg: { path, focus },
}: ReceiveArgument<OpenFileMessage>) {
  const filePath = resolvePath(document.uri.path, path)
  if (!filePath) {
    // file not found: ignore
    return
  }
  const uri = Uri.file(filePath)
  const isBranch = filePath.endsWith('/index.o.ts')
  const column = viewColumn === ViewColumn.One ? ViewColumn.Two : ViewColumn.One
  if (isBranch) {
    commands.executeCommand('vscode.openWith', uri, TREE_EDITOR_VIEW_TYPE, {
      preview: true,
      viewColumn: column,
      preserveFocus: isBranch,
    })
  } else {
    const doc = await workspace.openTextDocument(uri)
    window.showTextDocument(doc, column, !focus)
  }
}
