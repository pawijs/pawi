import { Block } from '@tuist/build'
import { HooksConfig } from './types'
import { setup } from './setup'

export * from './types'
export * from './helpers'

export const hooks: Block<HooksConfig> = {
  name: 'hooks',
  setup,
  state: {
    hooks: {},
  },
}
