import { Message } from '../../message.types'
import { TreeEditor } from '../types'
import { sendLibrary } from './library'
import { sendUpdate } from './update'

export function send(editor: TreeEditor, type: Message['type']) {
  switch (type) {
    case 'update':
      sendUpdate(editor)
      break
    case 'library':
      sendLibrary(editor)
      break
    default:
      console.error(`Invalid message type '${type}' to send.`)
      break
  }
}
