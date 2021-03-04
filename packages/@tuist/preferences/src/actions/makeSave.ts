import { mutate, pipe, throttle } from 'overmind'
import { Operator } from '../app'
import { deepGet } from '../helper'
import { setValue } from '../prefsDb'
import { ChangedArg, preferences_save } from '../types'

const setChanged: Operator<ChangedArg> = mutate(async function setChanged(
  ctx,
  value
) {
  const { state } = ctx
  const { changed } = value
  Object.assign(state.preferences.changed, changed)
})

const executeSave: Operator = mutate(async function executeSave(ctx) {
  const { state } = ctx
  const save_hook = ctx.actions.hooks[preferences_save]
  const { changed } = state.preferences

  for (const change of Object.keys(changed)) {
    const value = deepGet(state, change)
    if (!(await save_hook({ path: change, value }))) {
      await setValue(change, value)
    }
  }
})

export const makeSave: (ms: number) => Operator<ChangedArg> = ms => {
  return pipe(setChanged, throttle(ms), executeSave)
}
