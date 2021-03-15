import { Range, workspace, WorkspaceEdit } from 'vscode'
import { serializeSource } from '../helpers/serialize'
import { TreeEditor } from '../types'

export function receiveUpdate({ document }: TreeEditor, json: string) {
  const edit = new WorkspaceEdit()
  const text = serializeSource(json)
  edit.replace(document.uri, new Range(0, 0, document.lineCount, 0), text)
  return workspace.applyEdit(edit).then(() => document.save())
}
