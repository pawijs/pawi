import { IAction, IContext, IOperator } from 'overmind'
import { StyledConfig, styledDefaultTheme } from '@tuist/styled'
import { ThemeConfig, themeProxy } from '@tuist/theme'

import { FunctionComponent as Comp } from 'react'
import { DragdropConfig } from '@tuist/dragdrop'
import { EditorConfig } from './types'
import { LocaleConfig } from '@tuist/locale'
import { ShortcutsConfig } from '@tuist/shortcuts'
import { createHook } from 'overmind-react'
import { editorTheme } from './theme'
import styled from 'styled-components'

export { Comp, styled }

export type Config = DragdropConfig &
  EditorConfig &
  LocaleConfig &
  StyledConfig &
  ShortcutsConfig &
  ThemeConfig

export const theme = themeProxy(
  Object.assign({}, styledDefaultTheme, editorTheme)
)

export type Action<Input = void, Output = void> = IAction<Config, Input, Output>
export type AsyncAction<Input = void, Output = void> = IAction<
  Config,
  Input,
  Promise<Output>
>
export type Operator<Input = void, Output = Input> = IOperator<
  Config,
  Input,
  Output
>

export const useOvermind = createHook<Config>()

export type Context = IContext<Config>
