import { IAction } from 'overmind'
import { HooksConfig, SyncHook } from './types'

export function makeSyncHook<Arg = void>(
  hookName: string
): IAction<{ state: HooksConfig['state'] }, Arg, boolean | undefined | void> {
  return function runSyncHook(ctx, value) {
    const { state } = ctx
    const hooks = state.hooks[hookName] as SyncHook<Arg>[]
    if (hooks) {
      let done: boolean | undefined | void = false
      let idx = 0
      while (!done && hooks[idx]) {
        // Hook should return 'true' to block running.
        // true = "done"
        const result = hooks[idx](ctx, value)
        if ((result as any) instanceof Promise) {
          throw new Error(
            `Cannot run synchronous hook '${hookName}': some hooks are async.`
          )
        }
        done = result
        idx += 1
      }
      return done
    }
  }
}

export function makeHook<Arg = void>(
  hookName: string
): IAction<
  { state: HooksConfig['state'] },
  Arg,
  Promise<boolean | undefined | void>
> {
  return async function runAsyncHook(ctx, value) {
    const hooks = ctx.state.hooks[hookName]
    if (hooks) {
      let done: boolean | undefined | void = false
      let idx = 0
      while (!done && hooks[idx]) {
        // Hook should return 'true' to block running.
        done = await hooks[idx](ctx, value)
        idx += 1
      }
      return done
    }
  }
}
