import { renderStories } from '..'
import * as stories from './all'

declare var module: any

renderStories({}, stories)

// Hot Module Replacement
if (module.hot) {
  module.hot.accept()
}
