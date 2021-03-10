import { Action } from '../app'

export const toggleLibrary: Action = ctx => {
  ctx.state.treeEditor.showLibrary = !ctx.state.treeEditor.showLibrary
}
