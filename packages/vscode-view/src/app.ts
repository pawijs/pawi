import { StyledConfig, styledTheme } from '@forten/styled'
import { TreeConfig } from '@forten/tree'
import { TreeViewConfig } from '@forten/tree-view'
import { LocaleConfig } from '@pawi/locale'
import { defaultTheme, ThemeConfig, themeProxy } from '@pawi/theme'
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
export type AsyncAction<Input = void, Output = void> = IAction<
  Config,
  Input,
  Promise<Output>
>
export type Context = IContext<Config>

export type BaseTheme = typeof styledTheme & typeof defaultTheme

export const allThemes = Object.assign(
  Object.assign({}, defaultTheme, styledTheme)
)

export const theme = themeProxy(allThemes)

export const useOvermind = createHook<Config>()
