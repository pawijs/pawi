import { Block } from '@pawi/build'
import { locale } from '@pawi/locale'
import { theme } from '@pawi/theme'
import * as actions from './actions'
import { FaIconComponent } from './components'
import { settings } from './settings'
import { setup } from './setup'
import { StyledConfig } from './types'

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
