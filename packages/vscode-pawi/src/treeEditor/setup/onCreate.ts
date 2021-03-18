import { workspace } from 'vscode'
import { TreeEditorProxy } from '../types'

export function registerOnCreate(editor: TreeEditorProxy) {
  editor.disposables.push(
    workspace.onDidCreateFiles(e => {
      e.files.forEach(file => {
        if (file.path.endsWith('.o.ts')) {
          editor.send({
            type: 'fileCreated',
            path: file.path.replace(/\.o\.ts$/, '.o.js'),
          })
        }
      })
    })
  )
}
