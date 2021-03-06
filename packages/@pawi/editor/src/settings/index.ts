import { DragdropSettings } from '@pawi/dragdrop'
import { LocaleSettings } from '@pawi/locale'
import { StyledSettings } from '@pawi/styled'
import { ThemeSettings } from '@pawi/theme'
import { editorTheme } from '../theme'
import { EditorSettings } from '../types'
import { dragdrop } from './dragdrop'
import { editor } from './editor'
import { locale } from './locale'
import { styled } from './styled'

type Settings = DragdropSettings &
  EditorSettings &
  LocaleSettings &
  ThemeSettings &
  StyledSettings

export const settings: Settings = {
  dragdrop,
  editor,
  locale,
  styled,
  theme: {
    default: editorTheme,
  },
}
