import { CompositionHolder } from '../..'
import { Action } from '../../app'
import { textChanged as op } from '../actions'
import { sortAscending } from '../helpers'
import { Composition, Selection } from '../types'

export interface TextChangedArg {
  holder: CompositionHolder
  i: string
  s: Selection
}

export const textChanged: Action<TextChangedArg> = (ctx, value) => {
  const { editor } = ctx.effects
  const comp = editor.ensureComposition(value.holder) as Composition
  op({ comp, sortedIds: sortAscending(comp.g) }, value)
}
