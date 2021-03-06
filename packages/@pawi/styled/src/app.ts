import { LocaleConfig } from '@pawi/locale'
import { themeProxy } from '@pawi/theme'
import { IAction, IContext } from 'overmind'
import { createHook } from 'overmind-react'
import { FunctionComponent as Comp } from 'react'
import styled from 'styled-components'
import { styledTheme } from './theme'
import { StyledConfig } from './types'

export { styled, Comp }

export type Config = StyledConfig & LocaleConfig
export type Context = IContext<Config>

export type Action<Input = void, Output = void> = IAction<
  StyledConfig,
  Input,
  Output
>

export const useOvermind = createHook<Config>()
export const theme = themeProxy(styledTheme)
