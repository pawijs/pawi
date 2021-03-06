import { Action } from '../app'

export const toggleLibrary: Action = ctx => {
  ctx.state.pawi.showLibrary = !ctx.state.pawi.showLibrary
}
