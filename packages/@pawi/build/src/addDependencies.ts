import { Block } from './types'

function addBlock(
  result: Block[],
  included: { [key: string]: boolean },
  block: Block
) {
  const { dependencies } = block

  if (dependencies) {
    dependencies.forEach(dep => {
      addBlock(result, included, dep)
    })
  }
  if (!included[block.name]) {
    result.push(block)
    included[block.name] = true
  }
}

export function addDependencies(blocks: Block[]) {
  const included: { [name: string]: boolean } = {}
  // const included = Object.assign({}, ...blocks.map(b => ({ [b.name]: true })))
  const result: Block[] = []
  // The topmost module gets to insert modules to give them higher priority.
  blocks.forEach(b => addBlock(result, included, b))
  return result
}
