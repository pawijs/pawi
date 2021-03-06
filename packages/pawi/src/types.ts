export interface Update {
  (): void
}

export interface BaseContext {
  cache<T>(key: string, fn: () => T): T
  detached: boolean
}

export interface TChild<C extends Object> {
  value: TValue<C>
  updates: Update[]
}

export type TValue<C extends Object = {}> = {
  [k in keyof C]?: () => C[k]
} & { update?: Update }

export type TOptValue<C extends Object = {}> = TValue<C> | void

export type TContext<C extends Object = {}> = C & BaseContext

export type TNode<C extends Object = {}> = Partial<
  C & {
    // Return a value to parent (maybe using children values)
    link: (...arg: TValue<C>[]) => TOptValue<C>
    // Update only parts of the tree
    route: (...arg: Update[]) => void
    // This is like route but with all items
    collect: (children: Update) => Update
  }
>

export type TInitValue<T extends Object = {}> = TNode<T> | void

export interface TInit<C extends Object = {}> {
  (ctx: TContext<C>): TNode<C>
}

// Init function
export type Context = TContext<{}>
export type InitValue = TInitValue<{}>
export type Init = (ctx: Context) => InitValue
// Update function (if alone)
export type Child = TChild<{}>
// A Child or void
export type Value = TOptValue<{}>
export type Link = (...args: Child[]) => Value
// Module
export interface NodeModule extends TNode<{}> {
  init?: Init
}
