import { Action } from '../app'
import { appBadge } from '../helpers/appBadge.types'

export const setBadge: Action<{ text: string }> = (ctx, arg) => {
  const api = window[appBadge]
  if (!api) {
    return
  }
  api.set(arg.text)
}
