import { Context } from '../app'
import { appUpdate } from './appUpdate.types'

export function setupAppUpdate(ctx: Context) {
  const api = window[appUpdate]
  if (!api) {
    console.log(`'${appUpdate}' api not present.`)
    return
  }
  console.log(
    'check app update.',
    ctx.state.useragent.options.updateCheckInterval
  )
  api.onUpdate({
    callback: arg => ctx.actions.useragent.updateChanged(arg),
    // check every x seconds
    checkInterval: ctx.state.useragent.options.updateCheckInterval,
    allowPrerelease: ctx.state.useragent.options.allowPrerelease,
  })
}
