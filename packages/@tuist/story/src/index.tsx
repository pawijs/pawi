// So that 'async' actions work with parcel
import 'regenerator-runtime/runtime'
import * as React from 'react'
import ReactDOM from 'react-dom'

import { StoryRouter } from './components'
import { Stories } from './types'

export * from './types'
export { ComponentWrapper } from './components'
export * from './theme'

export * from './testing'

export interface StoriesDict {
  [key: string]: Stories
}

export interface RenderOptions {
  devtools?: string | boolean
  // Testing only
  beforeEach?: () => void
  // Testing only
  afterEach?: () => void
}

// only exported for testing.
export function makeApp(opts: RenderOptions, ...storiesList: StoriesDict[]) {
  const all: StoriesDict = Object.assign({}, ...storiesList)
  const stories = [...Object.keys(all).map(key => all[key])]
  return () => <StoryRouter opts={opts} stories={stories} />
}

// Cannot test ReactDOM.render...
/* istanbul ignore next */
export function renderStories(
  opts: RenderOptions = {},
  ...storiesList: StoriesDict[]
) {
  const App = makeApp(opts, ...storiesList)
  ReactDOM.render(<App />, document.getElementById('root'))
}
