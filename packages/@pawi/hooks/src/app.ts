import { IAction, IContext } from 'overmind'
import { HooksConfig } from './types'

export type Context = IContext<HooksConfig>
export type AsyncAction<Input = void, Output = void> = IAction<
  HooksConfig,
  Input,
  Promise<Output>
>
export type Action<Input = void, Output = void> = IAction<
  HooksConfig,
  Input,
  Output
>
