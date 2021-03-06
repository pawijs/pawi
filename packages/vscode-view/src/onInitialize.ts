import { Overmind } from 'overmind'
import { Action, Config } from './app'
// FIXME: remove tuist.json in production
import * as jtree from './tuist.json'

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
    ctx.state.tuist.tree = jtree
  } else {
    // @ts-ignore
    const vscode = acquireVsCodeApi()
    window.addEventListener('message', e => {
      ctx.actions.tuist.receive(e.data)
    })
    ctx.state.tuist.send = vscode.postMessage
    vscode.postMessage({ type: 'ready' })
  }
}
