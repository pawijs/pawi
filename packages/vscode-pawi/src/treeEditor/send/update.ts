import { parseSource } from '../helpers/serialize'
import { TreeEditor } from '../types'

export function sendUpdate({ document, send }: TreeEditor) {
  send({
    type: 'update',
    path: document.uri.path,
    text: parseSource(document.getText()),
  })
}
