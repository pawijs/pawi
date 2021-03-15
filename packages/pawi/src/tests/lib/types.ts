import { BaseContext } from '@pawi/base'
import { ThreeContext } from '@pawi/three'
import { TArg, TBlock, TContext, TValue } from 'pawi'

interface ContextValues extends BaseContext, ThreeContext {}

// Init function
export type Context = TContext<ContextValues>
export type Block = TBlock<ContextValues>
// Update function (if alone)
export type Arg = TArg<Context>
export type Value = TValue<Context>
