import { Block } from '@tuist/build'
import { editor } from '@tuist/editor'
import { shortcuts } from '@tuist/shortcuts'
import * as actions from './actions'
import { onInitialize } from './onInitialize'
import { settings } from './settings'
import * as tree from './tuist.json'
import { TuistConfig } from './types'
// import { settings } from './settings'

export const tuist: Block<TuistConfig> = {
  name: 'tuist',
  dependencies: [editor, shortcuts],
  onInitialize,
  settings,
  actions: {
    tuist: actions,
  },
  state: {
    tuist: {
      tree,
      doc: {},
      send: () => {},
    },
  },
}
