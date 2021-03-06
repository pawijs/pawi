import { AsyncAction } from '../app'
import { useragent_blur, useragent_focus } from '../types'

export interface FocusChangedArg {
  // set to true if current tab has focus
  focus: boolean
}

export const focusChanged: AsyncAction<FocusChangedArg> = async (ctx, arg) => {
  const { actions, state } = ctx
  const { focus } = arg
  if (state.useragent.focus === focus) {
    // No change: do not trigger hooks
    return
  }

  state.useragent.focus = focus
  if (focus) {
    await actions.hooks[useragent_focus]({ focus: true })
  } else {
    await actions.hooks[useragent_blur]({ blur: true })
  }
}
