import { Action } from '../app'
import { CompositionHolder } from '../lib'

export interface RemoveParagraphArg {
  holder: CompositionHolder
  id: string
}

export const removeParagraph: Action<RemoveParagraphArg> = (ctx, arg) => {
  const { holder, id } = arg
  const { composition } = holder
  if (!composition) {
    return
  }
  const { data, spath, g } = composition

  if (id === spath) {
    delete composition.spath
  }
  delete g[id]
  if (data) {
    delete data[id]
  }
  ctx.actions.editor.changed(holder)
}
