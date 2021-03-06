import { DragdropConfig } from '@pawi/dragdrop'
import { LocaleConfig } from '@pawi/locale'
import { themeProxy } from '@pawi/theme'
import { TreeConfig } from '@pawi/tree'
import { IAction, IContext } from 'overmind'
import { createHook } from 'overmind-react'
import { FunctionComponent as Comp } from 'react'
import styled from 'styled-components'
import { treeViewTheme } from './settings/theme'
import { TreeViewConfig } from './types'

export { styled, Comp }

export function css(strings: TemplateStringsArray, ...values: any[]): string {
  return strings.map((s, idx) => s + (values[idx] || '')).join('')
}

export type Config = TreeViewConfig & TreeConfig & DragdropConfig & LocaleConfig
export type Context = IContext<Config>

export const theme = themeProxy(treeViewTheme)

export const useOvermind = createHook<Config>()

export type Action<Input = void, Output = void> = IAction<Config, Input, Output>
