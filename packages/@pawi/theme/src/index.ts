import { Block } from '@pawi/build'
import { selectedTheme } from './derived'
import { setup } from './setup'
import { defaultTheme } from './themes/defaultTheme'
import { ThemeConfig } from './types'

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
