import { LocaleSettings } from '@pawi/locale'
import { ThemeSettings } from '@pawi/theme'
import { icons } from '../icons'
import { styledTheme } from '../theme'
import { StyledSettings } from '../types'
import { locale } from './locale'

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
