import { derive } from './app'
import { Theme } from './types'

export const selectedTheme: Theme = derive(parent => {
  const selectedTheme = parent.themes[parent.selected]
  const defaultTheme = parent.themes.default

  return Object.assign(
    {},
    defaultTheme || /* istanbul ignore next */ {},
    selectedTheme || /* istanbul ignore next */ {}
  )
})
