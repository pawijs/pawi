import { Block } from '@forten/build'
import { Initializer } from '@forten/build/dist/types'
import { dragdrop } from '@forten/dragdrop'
import * as actions from './actions'
import { onInitialize } from './onInitialize'
import { settings } from './settings'
import { TreeEditorConfig } from './types'

export const treeEditor: Block<TreeEditorConfig> = {
  name: 'pawi',
  dependencies: [dragdrop],
  onInitialize: onInitialize as Initializer,
  settings,
  actions: {
    pawi: actions,
  },
  state: {
    treeEditor: {
      loading: true,
      // dummy value
      path: '',
      dirname: '',
      showLibrary: false,
      send: () => {},
    },
  },
}
