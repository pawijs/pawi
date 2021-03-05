import { build } from '@tuist/build'
import { treeView } from '@tuist/tree-view'
import { Overmind } from 'overmind'
import { Provider } from 'overmind-react'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { tuist } from '.'
import { App } from './components'

const config = build(tuist).using(treeView).config()

ReactDOM.render(
  <Provider value={new Overmind(config, { devtools: false })}>
    <App />
  </Provider>,
  document.querySelector('#root')
)
