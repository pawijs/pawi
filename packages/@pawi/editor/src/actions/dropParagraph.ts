import { resolve } from '@pawi/build'
import { Action, Context } from '../app'
import { ensureComposition } from '../effects'
import { caretSelection, ChangesType } from '../lib'
import { makeOps } from '../lib/doOperation'
import { getAtPath } from '../lib/utils/getAtPath'
import { getSiblings } from '../lib/utils/getSiblings'
import { lastId } from '../lib/utils/lastId'
import {
  ChangeType,
  ElementOptionsType,
  SelectionType,
} from '../lib/utils/types'
import { EditorParaDrag, EditorParaDrop, isParaRefDrag } from '../types'

export type DropParagraphArg = EditorParaDrag &
  EditorParaDrop & { exported?: boolean }

interface DataResult {
  c: string
  data: any
  o?: ElementOptionsType
}

function getData(
  ctx: Context,
  value: DropParagraphArg
): DataResult | undefined {
  if (isParaRefDrag(value)) {
    const { sourceId, sourceRef } = value
    const source = resolve(ctx, sourceRef)
    if (!source) {
      console.log('MISSING SOURCE', sourceRef)
      return undefined
    }
    const comp = source.composition
    const data = comp && comp.data
    const elem = comp && comp.g[sourceId]
    const para = data && data[sourceId]
    if (elem && elem.c && para) {
      const result: DataResult = { c: elem.c, data: para }
      if (value.exported) {
        result.o = { e: true }
      }
      return result
    } else {
      return undefined
    }
  } else {
    const result: DataResult = Object.assign({}, value)
    if (value.exported) {
      result.o = { e: true }
    }
    return result
  }
}

export const dropParagraph: Action<DropParagraphArg> = (ctx, arg) => {
  const { editor } = ctx.effects
  const { holderRef, compId } = arg
  let { id } = arg
  const holder = resolve(ctx, holderRef)
  if (!holder) {
    console.log('MISSING TARGET', holderRef)
    return
  }

  if (isParaRefDrag(arg) && arg.sourceCompId === compId) {
    // Move paragraph
    const { sourceId } = arg
    // TODO: move this code into a helper function.
    if (sourceId === id) {
      // noop
    } else {
      const composition = ensureComposition(holder)
      if (!id) {
        id = lastId(composition.g)
      }
      const elem = getAtPath(composition, [sourceId])
      const prev = getAtPath(composition, [id])
      const [, next] = getSiblings(composition, [id])
      if (elem && prev && next) {
        const p = (prev.p + next.elem.p) / 2
        const change: ChangeType = {
          path: [sourceId],
          pathId: sourceId,
          op: 'update',
          elem: Object.assign({}, elem, { p }),
          resized: true,
        }
        const changes: ChangesType = {
          elements: {
            [sourceId]: change,
          },
          start: change,
          end: change,
        }
        const { spath } = composition
        let selection: SelectionType | undefined
        if (spath) {
          // Try to keep selection
          const target = getAtPath(composition, spath.split('.'), true)
          if (target) {
            selection = target.s
          }
        }

        editor.processOps({
          holder,
          ops: makeOps(changes, selection || caretSelection([sourceId], 0)),
        })

        ctx.actions.editor.changed(holder)
      } else {
        // should not happen. noop
      }
    }
  } else {
    // ADD PARAGRAPH
    const para = getData(ctx, arg)
    if (para) {
      ctx.actions.editor.createCustomParagraph({
        holder,
        type: para.c,
        afterId: id,
        o: para.o,
        data: JSON.parse(JSON.stringify(para.data)),
      })
    }
  }
}
