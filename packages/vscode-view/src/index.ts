import { Block } from '@tuist/build'
import { dragdrop } from '@tuist/dragdrop'
import * as actions from './actions'
import { onInitialize } from './onInitialize'
import { settings } from './settings'
import { TuistConfig } from './types'

export const tuist: Block<TuistConfig> = {
  name: 'tuist',
  dependencies: [dragdrop],
  onInitialize,
  settings,
  actions: {
    tuist: actions,
  },
  state: {
    tuist: {
      loading: true,
      // dummy value
      path:
        '/Users/maia/git/tuist/packages/examples/src/3D-cube/branch.tui.json',
      dirname: '/Users/maia/git/tuist/packages/examples/src/3D-cube',
      showLibrary: false,
      send: () => {},
    },
  },
}
