import {
  EditorToVSCodeMessage,
  VSCodeToEditorMessage,
} from '../../../message.types.js'
import { Action } from '../app'

export const receive: Action<VSCodeToEditorMessage> = (ctx, arg) => {
  // console.log('RECEIVE', arg)
  // Yeah TS is not that smart sometimes.
  ctx.actions.receive[arg.type](arg as any)
}

export const send: Action<EditorToVSCodeMessage> = (ctx, arg) => {
  // console.log('SEND', arg)
  ctx.state.treeEditor.send(arg)
}
