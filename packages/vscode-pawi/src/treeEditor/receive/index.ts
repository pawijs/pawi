import { WebviewPanel } from 'vscode'
import { Message } from '../../message.types'
import { TreeEditor } from '../types'
import { receiveReady } from './ready'
import { receiveSelect } from './select'
import { receiveUpdate } from './update'

export function registerReceive(editor: TreeEditor, panel: WebviewPanel) {
  panel.webview.onDidReceiveMessage(async (msg: Message) => {
    switch (msg.type) {
      case 'select':
        return receiveSelect(editor, panel.viewColumn, msg.path)
      case 'update':
        return receiveUpdate(editor, msg.text)
      case 'ready':
        return receiveReady(editor)
    }
  })
}
