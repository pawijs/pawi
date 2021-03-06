import { Source } from 'pawi'
import { Action } from '../app'
import { relativePath } from '../helpers/paths'

export interface DropArg {
  files: File[]
  strings: string[]
}

export const drop: Action<DropArg> = (ctx, arg) => {
  const { strings } = arg
  for (const path of strings) {
    const relPath = relativePath(ctx.state.pawi.dirname, path)
    const { tree } = ctx.state.pawi
    if (tree) {
      const content: Source['content'] = {
        file: relPath,
      }
      ctx.actions.tree.add({
        tree,
        content,
      })
    }
  }
}
