import { Action } from '../app'

export const toggleLibrary: Action = ctx => {
  ctx.state.tuist.showLibrary = !ctx.state.tuist.showLibrary
}
