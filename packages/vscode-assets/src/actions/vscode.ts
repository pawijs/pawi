import { TreeType } from '@tuist/tree'
import { Action } from '../app'
import { Message } from '../types'

export const receive: Action<Message> = (ctx, arg) => {
  console.log('RECEIVE', arg)
  // Called from vscode
  switch (arg.type) {
    case 'update': {
      const tree = JSON.parse(arg.text) as TreeType
      tree.version = Date.now().toString()
      ctx.state.tuist.tree = tree
    }
  }
}

export const send: Action<Message> = (ctx, arg) => {
  console.log('SEND', arg)
  // Call to vscode
  ctx.state.tuist.send(arg)
}
