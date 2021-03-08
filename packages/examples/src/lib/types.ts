import { TArg, TBlock, TContext, TValue } from 'pawi'
import { ContextTypes } from './context'

// Init function
export type Context = TContext<ContextTypes>
export type Block = TBlock<ContextTypes>
// Update function (if alone)
export type Arg = TArg<Context>
export type Value = TValue<Context>
