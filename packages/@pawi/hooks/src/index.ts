import { Block } from '@pawi/build'
import { setup } from './setup'
import { HooksConfig } from './types'

export * from './helpers'
export * from './types'

export const hooks: Block<HooksConfig> = {
  name: 'hooks',
  setup,
  state: {
    hooks: {},
  },
}
