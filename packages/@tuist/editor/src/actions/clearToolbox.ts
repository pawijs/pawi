import { Action } from '../app'
import { CompositionHolder } from '../lib/utils/types'

export interface ClearToolboxArgs {
  holder: CompositionHolder
}
export const clearToolbox: Action<ClearToolboxArgs> = (ctx, value) => {
  const { editor } = ctx.effects
  editor.ensureComposition(value.holder)
  editor.clearToolbox(value.holder)
}
