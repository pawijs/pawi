import { Range, workspace, WorkspaceEdit } from 'vscode'
import { serializeSource } from '../helpers/serialize'
import { ReceiveArgument } from '../types'
import { UpdateBranchMessage } from '../view/types'

export function updateBranch({
  editor: { document },
  msg,
}: ReceiveArgument<UpdateBranchMessage>) {
  const edit = new WorkspaceEdit()
  const text = serializeSource(msg.branch)
  edit.replace(document.uri, new Range(0, 0, document.lineCount, 0), text)
  return workspace.applyEdit(edit).then(() => document.save())
}
