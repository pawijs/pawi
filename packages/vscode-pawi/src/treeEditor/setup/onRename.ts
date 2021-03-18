import { workspace } from 'vscode'
import { TreeEditorProxy } from '../types'

// FIXME: register without an open editor...
// FIXME: UPDATE BRANCHES !!
export function registerOnRename(editor: TreeEditorProxy) {
  editor.disposables.push(
    workspace.onDidRenameFiles(e => {
      e.files.forEach(file => {
        const oldPath = file.oldUri.path
        const newPath = file.newUri.path
        if (oldPath.endsWith('.o.ts')) {
          if (newPath.endsWith('.o.ts')) {
            editor.send({
              type: 'fileRenamed',
              oldPath: oldPath.replace(/\.o\.ts$/, '.o.js'),
              newPath: newPath.replace(/\.o\.ts$/, '.o.js'),
            })
          } else {
            editor.send({
              type: 'fileDeleted',
              path: oldPath.replace(/\.o\.ts$/, '.o.js'),
            })
          }
        } else if (newPath.endsWith('.o.ts')) {
          editor.send({
            type: 'fileCreated',
            path: newPath.replace(/\.o\.ts$/, '.o.js'),
          })
        }
        // ignore other files
      })
    })
  )
}
