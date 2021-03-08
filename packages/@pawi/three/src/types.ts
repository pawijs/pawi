import { TArg, TBlock, TContext, TValue } from 'pawi'
import { ThreeContext } from './context'

// 'types' content is never exported and is just a wrapper to
// simplify typing of modules.

// Init function
export type Context = TContext<ThreeContext>
export type Block = TBlock<ThreeContext>
// Update function (if alone)
export type Arg = TArg<ThreeContext>
export type Value = TValue<ThreeContext>
