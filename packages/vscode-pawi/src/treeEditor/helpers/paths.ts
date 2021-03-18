import { resolve } from 'path'
import { workspace } from 'vscode'

export function isBare(path: string) {
  return !(
    path.startsWith('./') ||
    path.startsWith('../') ||
    path.startsWith('/') ||
    path === '.'
  )
}

// Return workspace root for this document
export function rootPath(documentPath: string) {
  const folders = workspace.workspaceFolders?.map(f => f.uri.path)
  if (!folders) {
    return undefined
  }
  // resolve in node_modules, hack for now
  for (const cwd of folders) {
    if (documentPath.startsWith(cwd)) {
      return cwd
    }
  }
  return undefined
}

// Resolve a relative path in the TreeEditor to an absolute path
export function resolvePath(documentPath: string, jsPath: string) {
  const path = jsPath.replace(/.js$/, '.ts')
  if (isBare(path)) {
    const root = rootPath(documentPath)
    if (!root) {
      return undefined
    }
    return resolve(root, 'node_modules', path.replace(/\/dist\//, '/src/'))
  } else {
    return resolve(documentPath, '..', path)
  }
}
