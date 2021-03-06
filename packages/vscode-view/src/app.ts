import { LocaleConfig } from '@pawi/locale'
import { StyledConfig, styledTheme } from '@pawi/styled'
import { defaultTheme, ThemeConfig, themeProxy } from '@pawi/theme'
import { TreeConfig } from '@pawi/tree'
import { TreeViewConfig } from '@pawi/tree-view'
import { IAction, IContext } from 'overmind'
import { createHook } from 'overmind-react'
import { FunctionComponent as Comp } from 'react'
import styled from 'styled-components'
import { PawiConfig } from './types'

export { styled, Comp }

export type Config = PawiConfig &
  LocaleConfig &
  ThemeConfig &
  StyledConfig &
  TreeConfig &
  TreeViewConfig

export type Action<Input = void, Output = void> = IAction<Config, Input, Output>
export type Context = IContext<Config>

export type BaseTheme = typeof styledTheme & typeof defaultTheme

export const allThemes = Object.assign(
  Object.assign({}, defaultTheme, styledTheme)
)

export const theme = themeProxy(allThemes)

export const useOvermind = createHook<Config>()
