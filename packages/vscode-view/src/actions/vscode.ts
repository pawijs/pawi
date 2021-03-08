import { TreeType } from '@forten/tree-type'
import { Action } from '../app'
import { getName, relativePath } from '../helpers/paths'
import { Message } from '../types'

export const receive: Action<Message> = (ctx, arg) => {
  console.log('RECEIVE', arg)
  // Called from vscode
  switch (arg.type) {
    case 'update': {
      const tree = JSON.parse(arg.text) as TreeType
      if (tree.version === ctx.state.pawi.tree?.version) {
        break
      }
      ctx.state.pawi.tree = tree
      ctx.state.pawi.path = arg.path
      ctx.state.pawi.dirname = arg.path.split('/').slice(0, -1).join('/')
      break
    }
    case 'library': {
      const { dirname } = ctx.state.pawi
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
  ctx.state.pawi.send(arg)
}
