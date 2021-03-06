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
      if (tree.version === ctx.state.tuist.tree?.version) {
        break
      }
      ctx.state.tuist.tree = tree
      ctx.state.tuist.path = arg.path
      ctx.state.tuist.dirname = arg.path.split('/').slice(0, -1).join('/')
      break
    }
    case 'library': {
      const { dirname } = ctx.state.tuist
      function makeBlock(path: string) {
        console.log('makeBlock', dirname, path, relativePath(dirname, path))
        return {
          name: getName(path),
          content: {
            file: relativePath(dirname, path),
          },
        }
      }
      ctx.state.treeView.library = arg.paths.map(makeBlock)
    }
  }
}

export const send: Action<Message> = (ctx, arg) => {
  // console.log('SEND', arg)
  // Call to vscode
  ctx.state.tuist.send(arg)
}
