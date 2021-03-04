import { Block } from '@tuist/build'
import { ThemeConfig } from './types'
import { defaultTheme } from './themes/defaultTheme'
import { selectedTheme } from './derived'
import { setup } from './setup'

export * from './components'
export * from './proxy'
export * from './themes'
export * from './types'

export const theme: Block<ThemeConfig> = {
  name: 'theme',
  setup,
  state: {
    theme: {
      selected: 'default',
      themes: {
        default: Object.assign({}, defaultTheme),
      },
      selectedTheme,
    },
  },
}
