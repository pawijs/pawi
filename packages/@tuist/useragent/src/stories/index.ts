import * as stories from './all'

import { renderStories } from '@tuist/story'

declare var module: any

renderStories({}, stories)

// Hot Module Replacement
if (module.hot) {
  module.hot.accept()
}
