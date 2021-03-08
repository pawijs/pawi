import { Overmind } from 'overmind'
import { AsyncAction, Config } from './app'
import * as jtree from './dev.json'

export const onInitialize: AsyncAction<Overmind<Config>> = async ctx => {
  // @ts-ignore
  if (typeof acquireVsCodeApi === 'undefined') {
    // development
    ctx.state.treeView.library = [
      {
        type: 'pawi',
        name: 'three.Mesh',
        content: { file: './lib/three.Mesh.js' },
      },
      {
        type: 'pawi',
        name: 'three.Lights',
        content: { file: './lib/three.Lights.js' },
      },
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
