import { Overmind } from 'overmind'
import { Action, Config } from './app'

export interface BootArg {
  app: Overmind<Config>
}

export const onInitialize: Action<BootArg> = ctx => {
  const vscode =
    // @ts-ignore
    typeof acquireVsCodeApi !== 'undefined'
      ? // @ts-ignore
        acquireVsCodeApi()
      : { postMessage() {} }

  window.addEventListener('message', e => {
    ctx.actions.tuist.receive(e.data)
  })
  ctx.state.tuist.send = vscode.postMessage

  vscode.postMessage({ type: 'ready' })
  // debug
  // ctx.state.treeView.library = [
  //   { name: 'three.Mesh', content: { file: 'lib/three.Mesh.js' } },
  //   { name: 'three.Lights', content: { file: 'lib/three.Lights.js' } },
  // ]
}
