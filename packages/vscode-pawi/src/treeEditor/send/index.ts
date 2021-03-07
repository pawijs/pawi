import { Message } from '../../message.types'
import { TreeEditor } from '../types'
import { sendLibrary } from './library'
import { sendUpdate } from './update'

export function send(editor: TreeEditor, type: Message['type']) {
  switch (type) {
    case 'update':
      return sendUpdate(editor)
    case 'library':
      return sendLibrary(editor)
    default:
      console.error(`Invalid message type '${type}' to send.`)
      return
  }
}
