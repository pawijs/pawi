import { Action } from '../app'

export const hasWebUpdate: Action = ctx => {
  const { useragent } = ctx.state
  const { hasUpdate } = useragent
  if (!hasUpdate) {
    // If we already have an update running, maybe a full app download: do not change.
    ctx.actions.useragent.updateChanged({
      status: 'ready',
      needsRestart: false,
    })
  }
}
