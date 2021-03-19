import { makeId, newTree } from '@forten/tree'
import { TreeType } from '@forten/tree-type'
import { libraryName, relativePath } from './paths'

export function addLibrayBlock(tree: TreeType, file: string) {
  const name = libraryName(file)
  if (name === '.') {
    return
  }
  const id = makeId(tree.blocks)
  tree.blocks[id] = {
    id,
    name,
    content: { file },
    children: [],
  }
}

export function makeLibrary(dirname: string, paths: string[]) {
  const tree = newTree('pawi', { name: 'root', content: {} })
  paths.forEach(path => addLibrayBlock(tree, relativePath(dirname, path)))
  return tree
}
