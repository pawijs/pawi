import { Block } from '@forten/build'
import { Initializer } from '@forten/build/dist/types'
import { dragdrop } from '@forten/dragdrop'
import * as actions from './actions/index.js'
import { onInitialize } from './onInitialize.js'
import * as receive from './receive/index.js'
import { settings } from './settings/index.js'
import { TreeEditorConfig } from './types'

export const treeEditor: Block<TreeEditorConfig> = {
  name: 'pawi',
  dependencies: [dragdrop],
  onInitialize: onInitialize as Initializer,
  settings,
  actions: {
    treeEditor: actions,
    receive,
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
