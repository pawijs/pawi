import { Block } from '@pawi/build'
import { onInitialize } from './onInitialize'
import { setup } from './setup'
import { ShortcutsConfig } from './types'

export * from './command'
export * from './types'

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
