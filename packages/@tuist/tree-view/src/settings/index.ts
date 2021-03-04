import { DragdropSettings } from '@tuist/dragdrop'
import { StyledSettings } from '@tuist/styled'
import { ThemeSettings } from '@tuist/theme'
import { dragdrop } from './dragdrop'
import { styled } from './styled'
import { treeViewTheme } from './theme'

type Settings = ThemeSettings & DragdropSettings & StyledSettings

export const settings: Settings = {
  dragdrop,
  styled,
  theme: {
    default: treeViewTheme,
  },
}
