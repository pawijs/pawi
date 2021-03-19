import { parseSource } from '../../helpers/serialize'
import { findAllBranches } from '../helpers/findAllBranches'
import { ReceiveArgument } from '../types'
import { ReadyMessage } from '../view/types'

export async function ready({
  editor: { document, send },
}: ReceiveArgument<ReadyMessage>) {
  send({
    type: 'updateBranch',
    path: document.uri.path,
    branch: parseSource(document.getText()),
  })
  send({
    type: 'library',
    paths: await findAllBranches(document.uri.path),
  })
}
