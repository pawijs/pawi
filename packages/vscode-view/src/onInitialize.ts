import { Overmind } from 'overmind'
import { Action, Config } from './app'
// FIXME: remove pawi.json in production
import * as jtree from './dev.json'

export interface BootArg {
  app: Overmind<Config>
}

export const onInitialize: Action<BootArg> = ctx => {
  // @ts-ignore
  if (typeof acquireVsCodeApi === 'undefined') {
    // development
    ctx.state.treeView.library = [
      { name: 'three.Mesh', content: { file: 'lib/three.Mesh.js' } },
      { name: 'three.Lights', content: { file: 'lib/three.Lights.js' } },
    ]
    // Whild debugging
    ctx.state.pawi.tree = jtree
  } else {
    // @ts-ignore
    const vscode = acquireVsCodeApi()
    window.addEventListener('message', e => {
      ctx.actions.pawi.receive(e.data)
    })
    ctx.state.pawi.send = vscode.postMessage
    vscode.postMessage({ type: 'ready' })
  }
}
