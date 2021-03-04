import { IAction, IContext } from 'overmind'

import { FunctionComponent as Comp } from 'react'
import { LocaleConfig } from '@tuist/locale'
import { StyledConfig } from './types'
import { createHook } from 'overmind-react'
import styled from 'styled-components'
import { styledTheme } from './theme'
import { themeProxy } from '@tuist/theme'
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
