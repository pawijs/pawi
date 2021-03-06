import { CaretSelectionType, CompositionHolder } from '../lib/utils/types'

import { Action } from '../app'
import { doEnter } from '../lib/doEnter'

export interface EnterPressArgs {
  holder: CompositionHolder
  selection: CaretSelectionType
  shift: boolean
  cmd: boolean
}

export const enterPress: Action<EnterPressArgs> = (ctx, value) => {
  const { editor } = ctx.effects
  const { selection, holder, shift, cmd } = value
  if (shift) {
    ctx.actions.editor.applyOp({ holder, selection, op: 'E', opts: {} })
  } else {
    const comp = editor.ensureComposition(value.holder)
    editor.processOps({ holder, ops: doEnter(comp, selection, cmd === true) })
    ctx.actions.editor.changed(holder)
  }
}
