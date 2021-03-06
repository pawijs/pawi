import { CommandEvent } from '@pawi/shortcuts'
import { CompositionHolder } from '../..'
import { Action } from '../../app'
import { enter as op } from '../actions'
import { sortAscending } from '../helpers'
import { Composition } from '../types'

export interface EnterArg {
  holder: CompositionHolder
  cmd: CommandEvent
}

export const enter: Action<EnterArg> = (ctx, value) => {
  const { editor } = ctx.effects
  const comp = editor.ensureComposition(value.holder) as Composition
  op({ comp, sortedIds: sortAscending(comp.g) }, value.cmd)
}
