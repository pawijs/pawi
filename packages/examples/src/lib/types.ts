import { TArg, TBlock, TContext, TValue } from 'examples/src/lib/node_modules/examples/src/lib/node_modules/pawi'
import { ContextTypes } from 'src/lib/context'

// Init function
export type Context = TContext<ContextTypes>
export type Block = TBlock<ContextTypes>
// Update function (if alone)
export type Arg = TArg<Context>
export type Value = TValue<Context>
