import { glob } from 'glob'
import { workspace } from 'vscode'
import { TreeEditor } from '../types'

function getFiles(cwd: string) {
  return new Promise<string[]>((resolve, reject) =>
    glob('**/*.awi.ts', { cwd }, (err, files) => {
      if (err) {
        reject(err)
      }
      resolve(files.map(f => `${cwd}/${f.replace(/\.ts$/, '.js')}`))
    })
  )
}

export async function sendLibrary(editor: TreeEditor) {
  const files: string[] = []
  const folders = workspace.workspaceFolders?.map(f => f.uri.path)
  if (folders) {
    for (const cwd of folders) {
      files.push(...(await getFiles(cwd)))
    }
    editor.send({
      type: 'library',
      paths: files,
    })
  }
}
