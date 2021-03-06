import { Action, Config } from '../app'
import {
  CompositionHolder,
  InitFunction,
  InitParagraph,
  ParagraphPayload,
  ProcessOpsArgs,
  SelectionType,
} from '../lib/utils/types'
import { OperationsKey, doOperation, makeOps } from '../lib/doOperation'

import { IContext } from 'overmind'
import { setParaFromText } from '../lib/utils/setParaFromText'

export interface ApplyOpArgs {
  holder: CompositionHolder
  selection: SelectionType
  op: OperationsKey
  opts: ParagraphPayload
}

export const applyOp: Action<ApplyOpArgs> = (ctx, value) => {
  const { editor } = ctx.effects
  editor.ensureComposition(value.holder)
  const ops = handleOp(ctx, value)
  editor.processOps(ops)
  ctx.actions.editor.changed(value.holder)
}

function isInitFunction(init: InitParagraph | undefined): init is InitFunction {
  return typeof init === 'function'
}

function handleOp(ctx: IContext<Config>, props: ApplyOpArgs): ProcessOpsArgs {
  const editor = ctx.state.editor.options()
  const { holder, selection, op, opts } = props
  if (opts.c) {
    const para = editor.paragraphs[opts.c]
    if (!para) {
      throw new Error(`Invalid custom paragraph '${opts.c}'.`)
    }
    if (opts.data) {
      // Data is there: no need to init
    } else {
      const init = para.init
      if (isInitFunction(init)) {
        const { data, o, c } = init(ctx, props)
        opts.data = data
        if (c) {
          // Overwrite custom paragraph type with init (allows multiple toolbox for same type of
          // paragraph)
          opts.c = c
        }
        if (o) {
          opts.o = o
        }
      } else if (init) {
        const { data, o, c } = JSON.parse(JSON.stringify(init))
        opts.data = data
        if (c) {
          // Overwrite custom paragraph type with init (allows multiple toolbox for same type of
          // paragraph)
          opts.c = c
        }
        if (o) {
          opts.o = o
        }
      }
    }
  }

  if (op === 'Input' && opts.i) {
    const args = setParaFromText(editor, opts.i)
    if (args) {
      return handleOp(ctx, { holder, op: args.op, selection, opts: args.opts })
    }
  }

  return {
    holder,
    ops: makeOps(
      doOperation(holder.composition!, selection, op, opts),
      selection
    ),
  }
}
