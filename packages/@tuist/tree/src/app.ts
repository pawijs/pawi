import { IAction, IContext } from 'overmind'
import { TreeConfig } from './types'

export function css(strings: TemplateStringsArray, ...values: any[]): string {
  return strings.map((s, idx) => s + (values[idx] || '')).join('')
}

export type Config = TreeConfig
export type Context = IContext<Config>

export type Action<Input = void, Output = void> = IAction<Config, Input, Output>
