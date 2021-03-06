import { Action, Operator } from '../app'
import { CompositionHolder, getTitle } from '../lib'
import { createOperator, mutate, pipe } from 'overmind'

import { store as storeState } from '../lib/undoRedo'

export type ChangedArg = CompositionHolder

const changedOp: Operator<ChangedArg> = mutate(function executeChange(
  ctx,
  holder
) {
  if (!holder.$changed) {
    holder.$changed = true
  }
  const { composition } = holder
  if (!composition) {
    return
  }
  const title = getTitle(composition) || ''
  if (title !== holder.title) {
    holder.title = title
  }
})

// FIXME: Use overmind's version
function throttle<Input>(ms: number): Operator<Input, Input> {
  let timeout: any
  let previousFinal: any

  return createOperator(
    'throttle',
    String(ms),
    (err, context, value, next, final) => {
      if (err) next(err, value)
      else {
        if (timeout) {
          previousFinal(null, value)
        } else {
          timeout = setTimeout(() => {
            timeout = null
            next(null, value)
          }, ms)
        }
        previousFinal = final
      }
    }
  )
}

export const changed: Action<ChangedArg> = pipe(
  changedOp,
  throttle(300),
  mutate(storeState)
)

export const store: Action<ChangedArg> = pipe(mutate(storeState))
