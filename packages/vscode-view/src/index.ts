import { Block } from '@pawi/build'
import { dragdrop } from '@pawi/dragdrop'
import * as actions from './actions'
import { onInitialize } from './onInitialize'
import { settings } from './settings'
import { PawiConfig } from './types'

export const pawi: Block<PawiConfig> = {
  name: 'pawi',
  dependencies: [dragdrop],
  onInitialize,
  settings,
  actions: {
    pawi: actions,
  },
  state: {
    pawi: {
      loading: true,
      // dummy value
      path:
        '/Users/maia/git/pawi/packages/examples/src/3D-cube/branch.awi.json',
      dirname: '/Users/maia/git/pawi/packages/examples/src/3D-cube',
      showLibrary: false,
      send: () => {},
    },
  },
}
