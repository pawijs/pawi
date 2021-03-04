import { IAction, derived } from 'overmind'

import { HooksConfig } from '@tuist/hooks'
import { LocaleConfig } from './types'

type Config = LocaleConfig & HooksConfig

export type Action<Input = void, Output = void> = IAction<Config, Input, Output>
export type AsyncAction<Input = void, Output = void> = IAction<
  Config,
  Input,
  Promise<Output>
>

export function derive<Value>(
  cb: (state: Config['state']['locale'], rootState: Config['state']) => Value
) {
  return derived(cb)
}
