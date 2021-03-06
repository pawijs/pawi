import {
  CompositionHolder,
  caretSelection,
  isStringElement,
} from '../../../lib'

import { Context } from '../../../app'
import { PasteOperation } from '../../..'
import { ensureComposition } from '../../../effects'
import { getAtPath } from '../../../lib/utils/getAtPath'
import { isRangeSelection } from '../../../lib/utils/types'

export function doPasteText(
  ctx: { state: Context['state']; actions: Context['actions'] },
  { text, holder }: { text: string; holder: CompositionHolder }
): boolean {
  const comp = ensureComposition(holder)
  const spath = comp.spath
  if (spath) {
    const elem = getAtPath(comp, spath.split('.'))

    if (elem) {
      const selection = elem.s
      if (selection) {
        const { getMarkup } = ctx.state.editor.options()
        const opts = getMarkup(text)
        if (opts) {
          ctx.actions.editor.applyOp({
            holder,
            selection,
            op: 'P',
            opts,
          })
        } else if (isStringElement(elem)) {
          // FIXME: this logic should move into applyOp I guess...
          const pos = selection.anchorOffset
          let finalText = elem.i.slice(0, pos) + text
          if (isRangeSelection(selection)) {
            finalText += elem.i.slice(selection.focusOffset)
          } else {
            finalText += elem.i.slice(pos)
          }
          ctx.actions.editor.applyOp({
            holder,
            selection: caretSelection(selection.anchorPath, pos + text.length),
            op: 'Input',
            opts: { i: finalText },
          })
        }
      }
    }
  }
  return true
}

export const pasteText: PasteOperation = async function (
  ctx: Context,
  type,
  args
) {
  const { holder, event } = args
  const text = event.clipboardData.getData(type)
  return await doPasteText(ctx, { text, holder })
}
