import { CompositionHolder, undoRedo } from '../lib'

import { Action } from '../app'

export const undo: Action<{ holder: CompositionHolder }> = (ctx, arg) => {
  undoRedo(ctx, arg.holder, -1)
}

export const redo: Action<{ holder: CompositionHolder }> = (ctx, arg) => {
  undoRedo(ctx, arg.holder, 1)
}
