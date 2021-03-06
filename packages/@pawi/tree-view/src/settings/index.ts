import { DragdropSettings } from '@pawi/dragdrop'
import { StyledSettings } from '@pawi/styled'
import { ThemeSettings } from '@pawi/theme'
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
