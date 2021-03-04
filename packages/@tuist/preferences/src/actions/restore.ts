import { AsyncAction } from '../app'
import { deepSet } from '../helper'
import { getValues } from '../prefsDb'
import { preferences_restore, preferences_restored } from '../types'

export const restore: AsyncAction = async ctx => {
  const { actions, state } = ctx
  const done = await actions.hooks[preferences_restore]()
  if (!done) {
    const values = await getValues()
    ctx.state.preferences.restoring = true
    values.forEach(({ path, value }) => {
      deepSet(state, path, value)
    })
    ctx.state.preferences.restoring = false
  }
  await actions.hooks[preferences_restored]()
}
