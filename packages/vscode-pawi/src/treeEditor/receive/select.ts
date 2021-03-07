import { Uri, ViewColumn, window, workspace } from 'vscode'
import { TreeEditor } from '../types'

export async function receiveSelect(
  { document }: TreeEditor,
  panelColumn: ViewColumn | undefined,
  path: string
) {
  const uri = Uri.file(document.uri.path + '/../' + path.replace(/.js$/, '.ts'))
  let doc = await workspace.openTextDocument(uri)
  const column =
    panelColumn === ViewColumn.One ? ViewColumn.Two : ViewColumn.One
  window.showTextDocument(doc, column)
}
