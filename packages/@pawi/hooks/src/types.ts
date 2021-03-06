export interface SyncHook<T = any> {
  (ctx: any, arg: T): boolean | undefined | void
}

export interface Hook<T = any> {
  (ctx: any, arg: T):
    | Promise<boolean | undefined | void>
    | boolean
    | undefined
    | void
}

export interface HooksSettings<HookDefinitions> {
  hooks?: HookDefinitions
}

export interface HooksConfig {
  state: {
    // PRIVATE
    hooks: { [key: string]: (Hook | SyncHook)[] }
  }
}
