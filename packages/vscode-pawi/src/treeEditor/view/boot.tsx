import { build } from '@forten/build'
import { tree } from '@forten/tree'
import { treeView } from '@forten/tree-view'
import { Overmind } from 'overmind'
import { Provider } from 'overmind-react'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { treeEditor } from '.'
import { App } from './components'

const config = build(treeEditor).using(tree).using(treeView).config()

ReactDOM.render(
  <Provider
    value={
      new Overmind(config, {
        devtools: '127.0.0.1:3031',
      })
    }
  >
    <App />
  </Provider>,
  document.querySelector('#root')
)
