import { Overmind } from 'overmind'
import { AsyncAction } from './app'

interface IMutation {
  method: string
  path: string
  args: any[]
}

export interface IFlushCallback {
  (
    mutations: IMutation[],
    paths: string[],
    flushId: number,
    isAsync: boolean
  ): void
}

export const onInitialize: AsyncAction<Overmind<any>> = async (ctx, app) => {
  const { preferences } = ctx.state
  const { paths } = preferences
  const flushCallback: IFlushCallback = function flushCallback(mutations) {
    const changed: { [path: string]: boolean } = {}
    let restoring = false
    mutations.forEach(mutation => {
      if (mutation.path === 'preferences.restoring') {
        // skip mutations while restoring
        restoring = mutation.args[0]
      }
      if (restoring) {
        return
      }
      const { path } = mutation
      if (paths.find(p => path.startsWith(p))) {
        switch (mutation.method) {
          case 'set': // continue
          case 'unset':
            changed[mutation.path] = true
            break
          default:
            console.error(
              `Method '${mutation.method}' on path '${mutation.path}' not supported by preferences.`
            )
        }
      }
    })
    if (Object.keys(changed).length) {
      ctx.actions.preferences.save({ changed })
    }
  }
  app.addFlushListener(flushCallback)
  await ctx.actions.preferences.selectDb()
}
