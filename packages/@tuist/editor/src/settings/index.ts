import { DragdropSettings } from '@tuist/dragdrop'
import { EditorSettings } from '../types'
import { LocaleSettings } from '@tuist/locale'
import { StyledSettings } from '@tuist/styled'
import { ThemeSettings } from '@tuist/theme'
import { dragdrop } from './dragdrop'
import { editor } from './editor'
import { editorTheme } from '../theme'
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
