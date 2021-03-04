import { AsyncAction } from '../app'
import { deletePrefsDb } from '../prefsDb'
import { preferences_clear } from '../types'

export const clear: AsyncAction<{ userId: string } | void> = async (
  ctx,
  arg
) => {
  const done = await ctx.actions.hooks[preferences_clear]()
  if (!done) {
    await deletePrefsDb(arg ? arg.userId : undefined)
  }
}
