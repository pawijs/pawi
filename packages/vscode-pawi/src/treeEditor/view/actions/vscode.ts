import { TreeType } from '@forten/tree-type'
import { Action } from '../app'
import { makeLibrary } from '../helpers/makeLibrary'
import { Message } from '../types'

export const receive: Action<Message> = (ctx, arg) => {
  console.log('RECEIVE', arg)
  // Called from vscode
  switch (arg.type) {
    case 'update': {
      const tree = JSON.parse(arg.text) as TreeType
      if (tree.version === ctx.state.treeEditor.tree?.version) {
        break
      }
      ctx.state.treeEditor.tree = tree
      ctx.state.treeEditor.path = arg.path
      ctx.state.treeEditor.dirname = arg.path.split('/').slice(0, -1).join('/')
      break
    }
    case 'library': {
      const { dirname } = ctx.state.treeEditor
      ctx.state.treeView.library = makeLibrary(dirname, arg.paths)
      break
    }
  }
}

export const send: Action<Message> = (ctx, arg) => {
  // console.log('SEND', arg)
  // Call to vscode
  ctx.state.treeEditor.send(arg)
}
