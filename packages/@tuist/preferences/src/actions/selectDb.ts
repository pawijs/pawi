import { AsyncAction } from '../app'
import { selectPrefsDb } from '../prefsDb'

export const selectDb: AsyncAction<{ userId: string } | void> = async (
  ctx,
  arg
) => {
  await selectPrefsDb(
    arg ? arg.userId : undefined,
    ctx.state.preferences.defaults
  )
  await ctx.actions.preferences.restore()
}
