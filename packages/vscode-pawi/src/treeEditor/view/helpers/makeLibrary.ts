import { makeId, newTree } from '@forten/tree'
import { relativePath, visibleName } from './paths'

export function makeLibrary(dirname: string, paths: string[]) {
  const tree = newTree('pawi', { name: 'root', content: {} })
  paths.forEach(path => {
    const file = relativePath(dirname, path)
    const name = visibleName(file)
    if (name === '.') {
      return
    }
    const id = makeId(tree.blocks)
    tree.blocks[id] = {
      id,
      name: visibleName(file),
      content: {
        file,
      },
      children: [],
    }
  })
  return tree
}
