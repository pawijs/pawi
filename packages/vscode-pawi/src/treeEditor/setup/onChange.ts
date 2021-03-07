import { workspace } from 'vscode'
import { send } from '../send'
import { TreeEditor } from '../types'

export function registerOnChange(editor: TreeEditor) {
  editor.disposables.push(
    workspace.onDidChangeTextDocument(e => {
      if (e.document.uri.toString() === editor.document.uri.toString()) {
        send(editor, 'update')
      }
    })
  )
}
