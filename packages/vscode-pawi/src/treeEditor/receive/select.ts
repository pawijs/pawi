import { commands, Uri, ViewColumn, window, workspace } from 'vscode'
import { TreeEditor, TREE_EDITOR_VIEW_TYPE } from '../types'

export async function receiveSelect(
  { document }: TreeEditor,
  panelColumn: ViewColumn | undefined,
  path: string
) {
  const uri = Uri.file(document.uri.path + '/../' + path.replace(/.js$/, '.ts'))
  const isBranch = path.endsWith('/index.o.js')
  const column =
    panelColumn === ViewColumn.One ? ViewColumn.Two : ViewColumn.One
  if (isBranch) {
    commands.executeCommand('vscode.openWith', uri, TREE_EDITOR_VIEW_TYPE, {
      preview: true,
      viewColumn: column,
      preserveFocus: isBranch,
    })
  } else {
    const doc = await workspace.openTextDocument(uri)
    console.log(path, isBranch)
    window.showTextDocument(doc, column)
  }
}
