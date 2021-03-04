import { Action } from '../../app'
import { CommandEvent } from '@tuist/shortcuts'
import { Composition } from '../types'
import { CompositionHolder } from '../..'
import { enter as op } from '../actions'
import { sortAscending } from '../helpers'

export interface EnterArg {
  holder: CompositionHolder
  cmd: CommandEvent
}

export const enter: Action<EnterArg> = (ctx, value) => {
  const { editor } = ctx.effects
  const comp = editor.ensureComposition(value.holder) as Composition
  op({ comp, sortedIds: sortAscending(comp.g) }, value.cmd)
}
