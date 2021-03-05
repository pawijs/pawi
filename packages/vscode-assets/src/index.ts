import { Block } from '@tuist/build'
import { editor } from '@tuist/editor'
import { shortcuts } from '@tuist/shortcuts'
import { newTree } from '@tuist/tree'
import * as actions from './actions'
import { settings } from './settings'
import { TuistConfig } from './types'
// import { settings } from './settings'

export const tuist: Block<TuistConfig> = {
  name: 'tuist',
  dependencies: [editor, shortcuts],
  settings,
  actions: {
    tuist: actions,
  },
  state: {
    tuist: {
      tree: newTree('tuist', {
        name: 'root',
        content: {
          file: '',
        },
      }),
      doc: {},
    },
  },
}
