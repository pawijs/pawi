import { Action } from '../app'
import { CompositionHolder } from '../lib'

export interface EnsureCompositionArg {
  holder: CompositionHolder
}

export const ensureComposition: Action<EnsureCompositionArg> = (
  ctx,
  { holder }
) => {
  ctx.effects.editor.ensureComposition(holder)
}
