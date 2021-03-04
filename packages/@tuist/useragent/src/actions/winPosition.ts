import { WinPosition, winPosition } from '../helpers/winPosition.types'

import { Action } from '../app'
import { unproxy } from '@tuist/build'

export const setWinPosition: Action<WinPosition> = (ctx, arg) => {
  const api = window[winPosition]
  if (!api) {
    return
  }
  api.set(unproxy(arg))
}

export const windowSizeChanged: Action<WinPosition> = (ctx, arg) => {
  const { useragent } = ctx.state
  if (!arg.default || (arg.default && useragent.winPosition.default)) {
    useragent.winPosition = arg
  }
}
