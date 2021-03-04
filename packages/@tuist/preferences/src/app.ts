import { IAction, IContext, IOperator } from 'overmind'
import { PreferencesConfig } from './types'
import { HooksConfig } from '@tuist/hooks'

export type Config = HooksConfig & PreferencesConfig

export type Context = IContext<Config>

export type Operator<Input = void, Output = void> = IOperator<
  Config,
  Input,
  Output
>
export type Action<Input = void, Output = void> = IAction<Config, Input, Output>
export type AsyncAction<Input = void, Output = void> = IAction<
  Config,
  Input,
  Promise<Output>
>
