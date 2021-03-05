import { Block } from '@tuist/build'
import { hooks } from '@tuist/hooks'
import * as actions from './actions'
import { setup } from './setup'
import { TreeConfig } from './types'

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
  dependencies: [hooks],
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
