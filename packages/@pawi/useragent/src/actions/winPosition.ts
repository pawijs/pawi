import { unproxy } from '@pawi/build'
import { Action } from '../app'
import { WinPosition, winPosition } from '../helpers/winPosition.types'

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
