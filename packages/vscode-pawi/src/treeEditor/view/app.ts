import { LocaleConfig } from '@forten/locale'
import { StyledConfig, styledTheme } from '@forten/styled'
import { defaultTheme, ThemeConfig, themeProxy } from '@forten/theme'
import { TreeConfig } from '@forten/tree'
import { TreeViewConfig } from '@forten/tree-view'
import { IAction, IContext } from 'overmind'
import { createHook } from 'overmind-react'
import { FunctionComponent as Comp } from 'react'
import styled from 'styled-components'
import { TreeEditorConfig } from './types'

export { styled, Comp }

export type Config = TreeEditorConfig &
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
