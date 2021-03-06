import { TContext, TNode, TValue } from 'pawi'

export interface ContextTypes {
  number: number
}

// Init function
export type Context = TContext<ContextTypes>
export type Node = TNode<ContextTypes>
export type Init = (ctx: Context) => Node
// Update function (if alone)
export type Value = TValue<Context>
export type Update = (...args: Value[]) => Value
