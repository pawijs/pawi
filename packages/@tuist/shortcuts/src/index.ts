import { Block } from '@tuist/build'
import { ShortcutsConfig } from './types'
import { onInitialize } from './onInitialize'
import { setup } from './setup'

export * from './types'
export * from './command'

export const shortcuts: Block<ShortcutsConfig> = {
  name: 'shortcuts',
  setup,
  state: {
    shortcuts: {
      settings: () => ({}),
      definitions: {},
    },
  },
  effects: {
    shortcuts: {
      // Dummy (set in onInitialize)
      run() {
        return false
      },
    },
  },
  onInitialize,
}
