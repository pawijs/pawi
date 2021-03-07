import { TreeEditor } from '../types'

export function sendUpdate({ document, send }: TreeEditor) {
  send({
    type: 'update',
    path: document.uri.path,
    text: document.getText(),
  })
}
