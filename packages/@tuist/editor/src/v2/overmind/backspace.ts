import { CompositionHolder } from '../..'
import { Action } from '../../app'
import { backspace as op } from '../actions'
import { sortAscending } from '../helpers'
import { Composition } from '../types'

export interface BackspaceArg {
  holder: CompositionHolder
}

export const backspace: Action<BackspaceArg> = (ctx, value) => {
  const { editor } = ctx.effects
  const comp = editor.ensureComposition(value.holder) as Composition
  op({ comp, sortedIds: sortAscending(comp.g) })
}
