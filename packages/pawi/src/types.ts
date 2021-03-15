/**
 * Update function. Will be collected by a parent and run when necessary
 * (usually on each frame).
 */
export interface Update {
  (): void
}

export type CacheFunction = <T>(
  key: string,
  set: () => T,
  cleanup?: (value: T) => void
) => T

/**
 * Raw context before it is augmented by the returned values of 'init'.
 * Parent blocks add to this context by having 'init' return an object
 * with new or changed context values.
 */
export interface BaseContext {
  cache: CacheFunction
}

export type TArg<C extends Object = {}> = {
  [k in keyof C]?: () => C[k]
} & { update?: Update }

export type TValue<C extends Object = {}> = TArg<C> | void

export interface TInit<C extends Object = {}> {
  (ctx: TContext<C>): Promise<TBlock<C>>
}

export type TContext<C extends Object = {}> = C & BaseContext

export type TResolvedBlock<C extends Object = {}> = Partial<
  C & {
    // This is the proper way to abort an init.
    error: string
    // Return a value to parent (maybe using children values)
    link: (...arg: TArg<C>[]) => TValue<C>
    // Update only parts of the tree
    route: (...arg: Update[]) => void
    // This is like route but with all items
    collect: (children: Update) => Update
  }
>

export type TBlock<C extends Object = {}> = Promise<TResolvedBlock<C>>

export type ReloadFn<T extends Object = {}> = (payload: {
  module: TBlockModule<T>
}) => Promise<TValue<T>>

export type TBlockModule<T extends Object = {}> = TResolvedBlock<{}> & {
  // The block is a branch definition
  branch?: string // JSON.stringify( Branch )
  // Init function exposed in block.
  init?: TInit<T>
  // The snowpack-pawi HMR plugin transforms sources and adds this
  // './types' export. It will also be used for scrubbing.
  pawi?: {
    reload?: ReloadFn
    blocks?: ReloadFn[]
  }
}
