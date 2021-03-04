import { Action } from '../app'
import { CompositionHolder } from '../lib'
import { SelectionType } from '../lib/utils/types'

export interface CutArg {
  holder: CompositionHolder
  selection: SelectionType
}

export const cut: Action<CutArg> = (ctx, arg) => {
  ctx.actions.editor.copy(arg)
  ctx.actions.editor.applyOp({
    holder: arg.holder,
    selection: arg.selection,
    op: 'Delete',
    opts: {},
  })
}
