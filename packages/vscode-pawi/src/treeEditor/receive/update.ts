import { Range, workspace, WorkspaceEdit } from 'vscode'
import { TreeEditor } from '../types'

export function receiveUpdate({ document }: TreeEditor, text: string) {
  const edit = new WorkspaceEdit()
  edit.replace(document.uri, new Range(0, 0, document.lineCount, 0), text)
  return workspace.applyEdit(edit).then(() => document.save())
}
