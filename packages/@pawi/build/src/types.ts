import { IAction, IConfiguration, Overmind } from 'overmind'
import { Options } from 'overmind/lib/internalTypes'

export interface Base extends IConfiguration {
  state: {}
  effects: {}
  actions: {}
  reactions: {}
}

export interface Using<T extends Block> {
  using<U extends Block>(b: U): Using<T & U>
  config(): Pick<T & Base, keyof IConfiguration>
  app(options?: Options): Overmind<T>
}

export interface UnknownObject {
  [key: string]: unknown
}

type Pass<T> = T
type UnWrap<T> = T[keyof T] extends Pass<infer U> ? U : never
type UnWrapSettings<T> = UnWrap<Required<T>>

export interface Setup<
  Config extends IConfiguration = any,
  SettingsType = unknown,
  UnWrapS = UnWrapSettings<SettingsType>
> {
  (config: Config, settings: Settings<UnWrapS>): void
}

export interface Settings<T> {
  [blockName: string]: T
}

export type Initializer = IAction<any, any, any>

export interface BaseBlock<SettingsType = any, MySettings = any> {
  name: string
  dependencies?: BaseBlock[]
  settings?: SettingsType
  onInitialize?: Initializer
  setup?: Setup<any, MySettings>
}

/** This interface should only be used when the App type for the block is fully
 * known (like in libraries) because it hides the actual config content.
 */
export type Block<
  Config extends IConfiguration = IConfiguration,
  SettingsType = any,
  MySettings = any
> = Config & BaseBlock<SettingsType, MySettings>
