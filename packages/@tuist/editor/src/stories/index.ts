import * as stories from './all'

import { renderStories } from '@tuist/story'

declare var module: any

// Hot Module Replacement
if (module.hot) {
  module.hot.accept()
}

renderStories({ devtools: false }, stories)
