import { EditorConfig } from '@tuist/editor'
import { LocaleConfig } from '@tuist/locale'
import { StyledConfig, styledTheme } from '@tuist/styled'
import { defaultTheme, ThemeConfig, themeProxy } from '@tuist/theme'
import { IContext } from 'overmind'
import { createHook } from 'overmind-react'
import { FunctionComponent as Comp } from 'react'
import styled from 'styled-components'
import { TuistConfig } from './types'

export { styled, Comp }

export type Config = TuistConfig &
  LocaleConfig &
  ThemeConfig &
  StyledConfig &
  EditorConfig

export type Context = IContext<Config>

export type BaseTheme = typeof styledTheme & typeof defaultTheme

export const allThemes = Object.assign(
  Object.assign({}, defaultTheme, styledTheme)
)

export const theme = themeProxy(allThemes)

export const useOvermind = createHook<Config>()
