import { workspace, WorkspaceEdit } from 'vscode'
import { getTouchedBranches } from '../helpers/getTouchedBranches'

export function registerOnDelete() {
  return workspace.onWillDeleteFiles(e => {
    const paths = e.files
      .map(f => f.path)
      .filter(path => path.endsWith('.o.ts'))
      .map(path => path.replace(/\.ts$/, '.js'))
    if (paths.length === 0) {
      return
    }
    e.waitUntil(
      new Promise(async (resolve, reject) => {
        const touched = await getTouchedBranches(paths)
        if (touched.length) {
          // Is this the correct way ?
          // Or should I simply show a warning ?
          reject(
            new Error(
              `Cannot delete files: they are used by branches '${touched
                .map(t => t.path)
                .join(' ')}'`
            )
          )
          resolve(new WorkspaceEdit())
        }
      })
    )
  })
}
