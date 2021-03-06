import { Context } from '../app'
import { DragdropHooks } from '../types'

export function runHook(name: keyof DragdropHooks, ctx: Context, value: any) {
  const { dragdrop } = ctx.state
  const { drag } = dragdrop
  if (!drag) {
    return
  }
  const type = drag.type
  const definition = ctx.state.dragdrop.definitions().types[type]
  if (!definition) {
    return
  }
  const hooks = definition.hooks
  if (!hooks) {
    return
  }
  const hook = hooks[name]
  if (!hook) {
    return
  }

  return hook(ctx, value) === true
}
