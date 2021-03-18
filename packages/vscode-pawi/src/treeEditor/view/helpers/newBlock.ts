import { Context } from '../app.js'
import { nameFromFile } from './paths.js'

export function newBasicBlock(ctx: Context, base = 'new-block') {
  const { blocks } = ctx.state.treeView.library
  let n = 0
  let file = `./${base}.o.js`
  while (Object.values(blocks).find(b => b.content.file === file)) {
    n += 1
    file = `./${base}-${n}.o.js`
  }
  return {
    name: nameFromFile(file),
    content: { file },
  }
}
