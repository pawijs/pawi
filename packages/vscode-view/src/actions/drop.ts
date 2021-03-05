import { Source } from 'tuist'
import { Action } from '../app'
import { relativePath } from '../helpers/paths'

export interface DropArg {
  files: File[]
  strings: string[]
}

export const drop: Action<DropArg> = (ctx, arg) => {
  const { strings } = arg
  for (const path of strings) {
    const relPath = relativePath(ctx.state.tuist.dirname, path)
    const { tree } = ctx.state.tuist
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
