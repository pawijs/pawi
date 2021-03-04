import { ThemeConfig, ThemeSettings } from './types'

import { Setup } from '@tuist/build'

export const setup: Setup<ThemeConfig, ThemeSettings> = (config, settings) => {
  // Extract all 'themes'
  const themes = config.state.theme.themes
  Object.keys(settings).forEach(blockName => {
    const themesExtra = settings[blockName]
    Object.keys(themesExtra).forEach(themeName => {
      if (!themes[themeName]) {
        themes[themeName] = {}
      }
      // Last defined theme value for conflicting keys wins.
      Object.assign(themes[themeName], themesExtra[themeName])
    })
  })
}
