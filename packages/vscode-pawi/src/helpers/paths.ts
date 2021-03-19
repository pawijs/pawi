import { resolve } from 'path'
import { Range, TextDocument, workspace } from 'vscode'
import { isBare } from '../treeEditor/view/helpers/paths'
export { isBare, relativePath } from '../treeEditor/view/helpers/paths'

export function fullRange(document: TextDocument) {
  const firstLine = document.lineAt(0)
  const lastLine = document.lineAt(document.lineCount - 1)
  return new Range(firstLine.range.start, lastLine.range.end)
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
    // Should make this structure src/dist mandatory for pawi blocks discovery
    // or only use this temporarily as a hack ?
    return resolve(root, 'node_modules', path.replace(/\/dist\//, '/src/'))
  } else {
    return resolve(documentPath, '..', path)
  }
}
