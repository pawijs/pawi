import { send } from '../send'
import { sendUpdate } from '../send/update'
import { TreeEditor } from '../types'

export function receiveReady(editor: TreeEditor) {
  sendUpdate(editor)
  send(editor, 'library')
}
