import { IAction, IContext } from 'overmind'

import { CodeEditorConfig } from './types'
import { FunctionComponent as Comp } from 'react'
import { LocaleConfig } from '@tuist/locale'
import { codeEditorTheme } from './theme'
import { createHook } from 'overmind-react'
import styled from 'styled-components'
import { themeProxy } from '@tuist/theme'
export { styled, Comp }

export function css(strings: TemplateStringsArray, ...values: any[]): string {
  return strings.map((s, idx) => s + (values[idx] || '')).join('')
}

export type Config = CodeEditorConfig & LocaleConfig
export type Context = IContext<Config>

export const theme = themeProxy(codeEditorTheme)

export const useOvermind = createHook<Config>()

export type Action<Input = void, Output = void> = IAction<Config, Input, Output>
