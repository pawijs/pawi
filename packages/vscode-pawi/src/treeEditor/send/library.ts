import { existsSync, readFileSync } from 'fs'
import { glob } from 'glob'
import { join } from 'path'
import { workspace } from 'vscode'
import { TreeEditor } from '../types'

function findFiles(cwd: string, prefix: string, ts = false) {
  return new Promise<string[]>((resolve, reject) =>
    glob(
      `!(node_modules)/**/*.o.${ts ? 'ts' : 'js'}`,
      { cwd, ignore: join(cwd, 'node_modules') },
      (err, files) => {
        if (err) {
          reject(err)
        }
        resolve(
          files.map(f => `${prefix}/${ts ? f.replace(/\.ts$/, '.js') : f}`)
        )
      }
    )
  )
}

function packageJson(
  cwd: string
): { name?: string; type?: string; dependencies?: { [lib: string]: string } } {
  const packageFile = join(cwd, 'package.json')
  if (!existsSync(packageFile)) {
    return {}
  }
  return JSON.parse(readFileSync(packageFile, 'utf-8'))
}

async function moduleFilesFromDep(cwd: string) {
  const { name, type } = packageJson(cwd)
  if (!name || type !== 'module') {
    // skip
    return []
  } else {
    return findFiles(cwd, name)
  }
}

async function moduleFiles(cwd: string) {
  const { dependencies } = packageJson(cwd)
  if (!dependencies) {
    return []
  }
  const files: string[] = []
  for (const dep in dependencies) {
    files.push(...(await moduleFilesFromDep(join(cwd, 'node_modules', dep))))
  }
  return files
}

export async function sendLibrary(editor: TreeEditor) {
  const base = editor.document.uri.path
  const folders = workspace.workspaceFolders?.map(f => f.uri.path)
  if (!folders) {
    return
  }
  for (const cwd of folders) {
    if (base.startsWith(cwd)) {
      const paths = [
        ...(await findFiles(cwd, cwd, true)),
        ...(await moduleFiles(cwd)),
      ]
      paths.sort()
      editor.send({
        type: 'library',
        paths,
      })
      return
    }
  }
}
