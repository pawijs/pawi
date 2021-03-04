// HOOKS CAN MUTATE COMPOSITION
// but they are only called from mutations themselves
//
import { HookArg, Mutation, MutateHook } from '../types'
import * as deleteParagraph from './deleteParagraph'
import * as clearSelection from './clearSelection'

function runAll<T>(
  obj: { [key: string]: MutateHook<T> },
  op: Mutation,
  arg: T
) {
  Object.keys(obj).forEach(key => obj[key](op, arg))
}

export function runHooks(op: Mutation, arg: HookArg) {
  switch (arg.type) {
    case 'clearSelection':
      return runAll(clearSelection, op, arg)
    case 'deleteParagraph':
      return runAll(deleteParagraph, op, arg)
  }
}
