export interface Update {
  (): void
}

export interface BaseContext {
  cache<T>(key: string, fn: () => T): T
  detached: boolean
}

export interface TChild<C extends Object> {
  value: TArg<C>
  updates: Update[]
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

export type TArg<C extends Object = {}> = {
  [k in keyof C]?: () => C[k]
} & { update?: Update }

export type TValue<C extends Object = {}> = TArg<C> | void

export interface TInit<C extends Object = {}> {
  (ctx: TContext<C>): Promise<TBlock<C>>
}
