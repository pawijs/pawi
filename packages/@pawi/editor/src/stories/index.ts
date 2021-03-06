import { renderStories } from '@pawi/story'
import * as stories from './all'

declare var module: any

// Hot Module Replacement
if (module.hot) {
  module.hot.accept()
}

renderStories({ devtools: false }, stories)
