import * as clipboard from 'clipboard-polyfill'
import { Action } from '../app'
import { CompositionHolder } from '../lib'
import { extractComposition } from '../lib/extractComposition'
import { toHTML } from '../lib/toHTML'
import { toText } from '../lib/toText'
import { makeRangeSelection } from '../lib/utils/rangeSelection'
import { SelectionType } from '../lib/utils/types'

export interface CopyArg {
  holder: CompositionHolder
  selection: SelectionType
}

export const copy: Action<CopyArg> = (ctx, arg) => {
  const { selection, holder } = arg
  const { editor } = ctx.effects
  const comp = editor.ensureComposition(holder)
  const subComp = extractComposition(comp, makeRangeSelection(comp, selection))
  const dt = new clipboard.ClipboardItem({
    'text/html': toHTML(subComp),
    'text/plain': toText(subComp),
    'pawi/editor': JSON.stringify(subComp),
  })
  clipboard.write([dt])
}
