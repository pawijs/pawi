import { IAction, IContext } from 'overmind'

import { FunctionComponent as Comp } from 'react'
import { DragdropConfig } from '@tuist/dragdrop'
import { LocaleConfig } from '@tuist/locale'
import { TreeConfig } from '@tuist/tree'
import { TreeViewConfig } from './types'
import { createHook } from 'overmind-react'
import styled from 'styled-components'
import { themeProxy } from '@tuist/theme'
import { treeViewTheme } from './settings/theme'
export { styled, Comp }

export function css(strings: TemplateStringsArray, ...values: any[]): string {
  return strings.map((s, idx) => s + (values[idx] || '')).join('')
}

export type Config = TreeViewConfig & TreeConfig & DragdropConfig & LocaleConfig
export type Context = IContext<Config>

export const theme = themeProxy(treeViewTheme)

export const useOvermind = createHook<Config>()

export type Action<Input = void, Output = void> = IAction<Config, Input, Output>
