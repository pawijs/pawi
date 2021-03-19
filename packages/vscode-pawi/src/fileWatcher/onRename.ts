import { makeId } from '@forten/tree'
import { dirname } from 'path'
import { Uri, workspace, WorkspaceEdit } from 'vscode'
import { getTouchedBranches } from '../helpers/getTouchedBranches'
import { fullRange, relativePath } from '../helpers/paths'
import { serializeSource } from '../helpers/serialize'
import { nameFromFile } from '../treeEditor/view/helpers/paths'

// Handle file renames and update branches automatically.
// There is another file rename watch for the library of the TreeEditor.
export function registerOnRename() {
  return workspace.onDidRenameFiles(async e => {
    const blockRenames = e.files
      .map(f => ({ oldPath: f.oldUri.path, newPath: f.newUri.path }))
      .filter(f => f.oldPath.endsWith('.o.ts'))
      .map(({ oldPath, newPath }) => ({
        oldPath: oldPath.replace(/\.ts$/, '.js'),
        newPath: newPath.replace(/\.ts$/, '.js'),
      }))
    if (blockRenames.length === 0) {
      return
    }
    const touchedBranches = await getTouchedBranches(
      blockRenames.map(rename => rename.oldPath)
    )
    for (const { branch, path, blocks } of touchedBranches) {
      const edit = new WorkspaceEdit()
      const renames = blockRenames.map(b => ({
        oldFile: relativePath(dirname(path), b.oldPath),
        newFile: relativePath(dirname(path), b.newPath),
      }))
      for (const block of blocks) {
        const rename = renames.find(b => b.oldFile === block.content.file)
        if (rename) {
          // change in place
          block.name = nameFromFile(rename.newFile)
          block.content.file = rename.newFile
        }
      }
      // Mark as changed
      branch.version = makeId({ [branch.version]: true })
      const text = serializeSource(JSON.stringify(branch, null, 2))
      const document = await workspace.openTextDocument(Uri.file(path))
      edit.replace(document.uri, fullRange(document), text)
      workspace.applyEdit(edit).then(() => document.save())
    }
  })
}
