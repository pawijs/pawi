import { IAction, IContext } from 'overmind'
import styled, { css } from 'styled-components'

import { FunctionComponent as Comp } from 'react'
import { DragdropConfig } from './types'
import { createHook } from 'overmind-react'
import { dragdropTheme } from './theme'
import { themeProxy } from '@tuist/theme'

export { css, styled, Comp }

export const theme = themeProxy(dragdropTheme)

export type Config = DragdropConfig

export type Context = IContext<Config>

export type Action<Input = void, Output = void> = IAction<Config, Input, Output>

export const useOvermind = createHook<Config>()
