import * as actions from './actions'

import { Block } from '@tuist/build'
import { TreeConfig } from './types'
import { setup } from './setup'

export * from './helpers'
export {
  BlockDefinition,
  BranchDefinition,
  StringMap,
  TreeConfig,
  TreeDefinitions,
  TreeSettings,
  TreeType,
} from './types'

export const tree: Block<TreeConfig> = {
  name: 'tree',
  setup,
  state: {
    tree: {
      // Dummy. Set with 'setup'
      definitions: () => ({}),
    },
  },
  actions: {
    tree: actions,
  },
}
