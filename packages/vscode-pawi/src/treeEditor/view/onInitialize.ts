import { AsyncAction } from './app'
import jtree from './dev.json'
import { makeLibrary } from './helpers/makeLibrary'

export const onInitialize: AsyncAction = async ctx => {
  // @ts-ignore
  if (typeof acquireVsCodeApi === 'undefined') {
    // Whild debugging
    ctx.state.treeView.library = makeLibrary('/this/foo/bar', [
      '@pawi/three/three.Mesh.o.js',
      '@pawi/three/three.Scene.o.js',
      '@pawi/three/three.Lights.o.js',
      '@pawi/base/anim.Loop.o.js',
      '@pawi/base/base.value.o.js',
      '/this/foo/bar/slider.o.js',
      '/this/foo/3D-cube/index.o.js',
      '/this/foo/blank/index.o.js',
    ])
    ctx.state.treeEditor.tree = jtree
  } else {
    // @ts-ignore
    const vscode = acquireVsCodeApi()
    window.addEventListener('message', e => {
      ctx.actions.treeEditor.receive(e.data)
    })
    ctx.state.treeEditor.send = vscode.postMessage
    vscode.postMessage({ type: 'ready' })
  }
}
