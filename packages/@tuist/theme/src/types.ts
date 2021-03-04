import { defaultTheme } from './themes/defaultTheme'

type DefaultTheme = typeof defaultTheme

export interface Theme extends DefaultTheme {
  [key: string]: any
}

export interface ThemeConfig {
  state: {
    theme: {
      selected: string
      themes: Themes
      // Computed from selected, default and themes
      selectedTheme: Theme
    }
  }
}

export interface Themes {
  [themeName: string]: {
    [Key: string]: any
  }
}

export interface ThemeSettings {
  theme?: Themes
}
