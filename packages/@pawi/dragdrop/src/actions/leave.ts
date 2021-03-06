import { Action } from '../app'
import { runHook } from '../helpers'

export const leave: Action = ctx => {
  const { state } = ctx
  // Leave hook is run before
  runHook('leave', ctx, {})

  delete state.dragdrop.drop
}
