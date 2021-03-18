import { workspace } from 'vscode'
import { parseSource } from '../helpers/serialize'
import { TreeEditorProxy } from '../types'

export function registerOnChange(editor: TreeEditorProxy) {
  editor.disposables.push(
    workspace.onDidChangeTextDocument(e => {
      const { document } = editor
      if (e.document.uri.toString() === document.uri.toString()) {
        editor.send({
          type: 'updateBranch',
          path: document.uri.path,
          branch: parseSource(document.getText()),
        })
      }
    })
  )
}
