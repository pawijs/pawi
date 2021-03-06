import { Action } from '../app'
import { runHook } from '../helpers'
import { DragData, Position } from '../types'

export interface StartArg {
  drag: DragData
  position: Position
}

export const start: Action<StartArg> = (ctx, value) => {
  const { state } = ctx
  const transforms = state.dragdrop.definitions().dragTransform
  let { drag } = value
  const { type } = drag

  // Transform on drag start
  const transformers = transforms[type]
  if (transformers) {
    for (const transform of Object.values(transformers)) {
      const newDrag = transform(ctx, drag)
      if (newDrag) {
        drag = newDrag
        break
      }
    }
  }

  state.dragdrop.drag = drag
  state.dragdrop.position = value.position

  // Start hook is run after
  runHook('start', ctx, value)
}
