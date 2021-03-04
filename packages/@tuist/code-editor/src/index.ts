import * as actions from './actions'

import { Block, settings } from '@tuist/build'
import { StyledSettings, styled } from '@tuist/styled'
import { ThemeSettings, theme } from '@tuist/theme'

import { CodeEditorConfig } from './types'
import { codeEditorTheme } from './theme'
import { icons } from './icons'
import { locale } from '@tuist/locale'

export * from './components'
export * from './theme'
export * from './types'

export const codeEditor: Block<CodeEditorConfig> = {
  name: 'treeView',
  dependencies: [locale, theme, styled],
  settings: settings<ThemeSettings & StyledSettings>({
    styled: {
      icons,
    },
    theme: {
      default: codeEditorTheme,
    },
  }),
  state: {
    codeEditor: {},
  },
  actions: {
    codeEditor: actions,
  },
}
