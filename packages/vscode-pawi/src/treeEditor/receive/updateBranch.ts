import { workspace, WorkspaceEdit } from 'vscode'
import { fullRange } from '../../helpers/paths'
import { serializeSource } from '../../helpers/serialize'
import { ReceiveArgument } from '../types'
import { UpdateBranchMessage } from '../view/types'

export function updateBranch({
  editor: { document },
  msg,
}: ReceiveArgument<UpdateBranchMessage>) {
  const edit = new WorkspaceEdit()
  const text = serializeSource(msg.branch)
  edit.replace(document.uri, fullRange(document), text)
  return workspace.applyEdit(edit).then(() => document.save())
}
