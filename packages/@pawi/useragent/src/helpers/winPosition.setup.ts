import { Context } from '../app'
import { winPosition } from './winPosition.types'

export function setupWinPosition(ctx: Context) {
  const api = window[winPosition]
  if (!api) {
    return
  }
  api.onChange(ctx.actions.useragent.windowSizeChanged)
}
