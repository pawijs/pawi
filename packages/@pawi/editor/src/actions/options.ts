import { CommandEvent } from '@pawi/shortcuts'
import { sortedIds } from '..'
import { Action } from '../app'
import { CompositionHolder, ElementOptionsType, SelectionType } from '../lib'

const CYCLE_a: ElementOptionsType['a'][] = ['l', 'c', 'r', 'j']

export interface ToggleExportArg {
  holder: CompositionHolder
  id: string
  key: 'e' | 'open'
}

function cycle<T = string>(values: T[], value: T, inc: number = 1): T {
  return values[(values.length + values.indexOf(value) + inc) % values.length]
}

export const toggleOption: Action<ToggleExportArg> = (ctx, arg) => {
  const { effects } = ctx
  const { holder, id, key } = arg
  const composition = effects.editor.ensureComposition(holder)
  const elem = composition.g[id]
  if (elem) {
    const { o } = elem
    if (o) {
      if (o[key]) {
        if (Object.keys(o).length === 1) {
          delete elem.o
        } else {
          delete o[key]
        }
      } else {
        o[key] = true
      }
    } else {
      elem.o = { [key]: true }
    }
  }
  if (key !== 'open') {
    // No need to store open state
    ctx.actions.editor.changed(holder)
  }
}

export interface CycleAlignArg {
  holder: CompositionHolder
  id: string
  cmd: CommandEvent
}

export const cycleAlign: Action<CycleAlignArg> = (ctx, arg) => {
  const { effects } = ctx
  const { holder, id } = arg
  const composition = effects.editor.ensureComposition(holder)
  const elem = composition.g[id]
  if (!elem) {
    return
  }
  let o = elem.o
  if (!o) {
    o = elem.o = {}
  }
  const cf = o.a || 'j'
  const f = cycle(CYCLE_a, cf)
  if (f === 'j') {
    delete o.a
    if (!Object.keys(o).length) {
      delete elem.o
    }
  } else {
    o.a = f
  }
  ctx.actions.editor.changed(holder)
}

export interface SetOption {
  holder: CompositionHolder
  key: keyof ElementOptionsType
  id: string
  value: any
}

export const setOption: Action<SetOption> = (ctx, arg) => {
  const { effects } = ctx
  const { holder, key, id, value } = arg
  const composition = effects.editor.ensureComposition(holder)
  const elem = composition.g[id]
  if (elem) {
    let { o } = elem
    if (value) {
      if (!o) {
        o = elem.o = {}
      }
      o[key] = value
    } else if (o) {
      delete o[key]
    }
  }
  ctx.actions.editor.changed(holder)
}

export const toggleColumn: Action<{
  holder: CompositionHolder
  id: string
  selection: SelectionType
}> = (ctx, arg) => {
  const { effects } = ctx
  const { holder, id, selection } = arg
  const composition = effects.editor.ensureComposition(holder)
  const elem = composition.g[id]
  if (elem) {
    const { o } = elem
    if (!o || !o.u) {
      ctx.actions.editor.applyOp({
        holder,
        selection,
        op: 'P',
        opts: { o: { u: 'r' } },
      })
    } else if (o.u) {
      const ids = sortedIds(composition.g)
      const startIdx = ids.indexOf(id)
      if (startIdx >= 0) {
        for (let idx = startIdx; idx < ids.length; ++idx) {
          const elem = composition.g[ids[idx]]
          console.log(idx, elem)
          if (elem && elem.o?.u) {
            delete elem.o.u
            delete elem.o.uw
            if (!Object.keys(elem.o).length) {
              delete elem.o
            }
          }
        }
      }
    }
    ctx.actions.editor.changed(holder)
  }
}
