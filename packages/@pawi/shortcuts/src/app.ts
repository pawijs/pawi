import { IAction } from 'overmind'
import { ShortcutsConfig } from './types'

export type Config = ShortcutsConfig

export type Action<Input = void, Output = void> = IAction<Config, Input, Output>
