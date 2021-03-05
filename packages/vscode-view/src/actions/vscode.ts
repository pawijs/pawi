import { TreeType } from 'tuist'
import { Action } from '../app'
import { getName, relativePath } from '../helpers/paths'
import { Message } from '../types'

export const receive: Action<Message> = (ctx, arg) => {
  console.log('RECEIVE', arg)
  // Called from vscode
  switch (arg.type) {
    case 'update': {
      const tree = JSON.parse(arg.text) as TreeType
      tree.version = Date.now().toString()
      ctx.state.tuist.tree = tree
      ctx.state.tuist.path = arg.path
      ctx.state.tuist.dirname = arg.path.split('/').slice(0, -1).join('/')
      break
    }
    case 'library': {
      function makeBlock(path: string) {
        return {
          name: getName(path),
          content: {
            file: relativePath(ctx.state.tuist.dirname, path),
          },
        }
      }
      ctx.state.treeView.library = arg.paths.map(makeBlock)
    }
  }
}

export const send: Action<Message> = (ctx, arg) => {
  console.log('SEND', arg)
  // Call to vscode
  ctx.state.tuist.send(arg)
}
