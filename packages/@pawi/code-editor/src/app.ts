import { LocaleConfig } from '@pawi/locale'
import { themeProxy } from '@pawi/theme'
import { IAction, IContext } from 'overmind'
import { createHook } from 'overmind-react'
import { FunctionComponent as Comp } from 'react'
import styled from 'styled-components'
import { codeEditorTheme } from './theme'
import { CodeEditorConfig } from './types'

export { styled, Comp }

export function css(strings: TemplateStringsArray, ...values: any[]): string {
  return strings.map((s, idx) => s + (values[idx] || '')).join('')
}

export type Config = CodeEditorConfig & LocaleConfig
export type Context = IContext<Config>

export const theme = themeProxy(codeEditorTheme)

export const useOvermind = createHook<Config>()

export type Action<Input = void, Output = void> = IAction<Config, Input, Output>
