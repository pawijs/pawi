import { Action } from '../app'
import { runHook } from '../helpers'

export const release: Action = ctx => {
  const { state } = ctx
  // Release hook is run before drop operation.
  runHook('release', ctx, {})

  let { drag, drop } = state.dragdrop
  if (drag && drop) {
    // Transform ?
    if (drag.type !== drop.type) {
      const transforms = state.dragdrop.definitions().dropTransform
      const transform = (transforms[drag.type] || {})[drop.type]
      if (!transform) {
        // This should never happen because the drop was accepted because there is a
        // transform
        throw new Error(`No transform from '${drag.type}' to '${drop.type}'.`)
      }
      const newDrag = transform(ctx, drag)
      if (newDrag) {
        drag = newDrag
      } else {
        console.log(
          `Drop transform from '${drag.type}' to '${drop.type}' failed.`
        )
        // abort
        delete state.dragdrop.drag
        delete state.dragdrop.drop
        return
      }
    }
    drop.callback(Object.assign({}, drag.payload, drop.payload))
  }

  delete state.dragdrop.drag
  delete state.dragdrop.drop
}
