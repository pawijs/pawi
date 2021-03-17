import { build } from '@forten/build'
import { tree } from '@forten/tree'
import { treeView } from '@forten/tree-view'
import { Overmind } from 'overmind'
import { Provider } from 'overmind-react'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { App } from './components/index.js'
import { treeEditor } from './index.js'

const config = build(treeEditor).using(tree).using(treeView).config()

ReactDOM.render(
  <Provider value={new Overmind(config, { devtools: false })}>
    <App />
  </Provider>,
  document.querySelector('#root')
)
