import { workspace } from 'vscode'
import { TreeEditorProxy } from '../types'

export function registerOnDelete(editor: TreeEditorProxy) {
  editor.disposables.push(
    workspace.onDidDeleteFiles(e => {
      e.files.forEach(file => {
        if (file.path.endsWith('.o.ts')) {
          editor.send({
            type: 'fileDeleted',
            path: file.path.replace(/\.o\.ts$/, '.o.js'),
          })
        }
      })
    })
  )
}
