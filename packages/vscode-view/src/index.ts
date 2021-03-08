import { Block } from '@forten/build'
import { dragdrop } from '@forten/dragdrop'
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
      path: '',
      dirname: '',
      showLibrary: false,
      send: () => {},
    },
  },
}
