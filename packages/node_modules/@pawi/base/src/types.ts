import { TArg, TBlock, TContext, TValue } from 'pawi'
import { BaseContext } from './context'

// 'types' content is never exported and is just a wrapper to
// simplify typing of modules.

// Init function
export type Context = TContext<BaseContext>
export type Block = TBlock<BaseContext>
// Update function (if alone)
export type Arg = TArg<BaseContext>
export type Value = TValue<BaseContext>
