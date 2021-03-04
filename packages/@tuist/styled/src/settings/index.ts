import { LocaleSettings } from '@tuist/locale'
import { StyledSettings } from '../types'
import { ThemeSettings } from '@tuist/theme'
import { icons } from '../icons'
import { locale } from './locale'
import { styledTheme } from '../theme'

type Settings = LocaleSettings & StyledSettings & ThemeSettings

export const settings: Settings = {
  locale,
  theme: {
    default: styledTheme,
  },
  styled: {
    icons,
  },
}
