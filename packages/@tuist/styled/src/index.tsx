import * as actions from './actions'

import { Block } from '@tuist/build'
import { FaIconComponent } from './components'
import { StyledConfig } from './types'
import { locale } from '@tuist/locale'
import { settings } from './settings'
import { setup } from './setup'
import { theme } from '@tuist/theme'

export * from './components'
export * from './theme'
export * from './types'

export const styled: Block<StyledConfig> = {
  name: 'styled',
  setup,
  dependencies: [locale, theme],
  settings,
  state: {
    styled: {
      iconProvider: () => ({
        IconComponent: FaIconComponent,
        icons: {},
      }),
      sizes: {},
      // These are dummy value replaced
      familyComponents: null as any,
      show: {},
      showTips: true,
    },
  },
  actions: {
    styled: actions,
  },
}
