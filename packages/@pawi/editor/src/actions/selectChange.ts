import { CompositionHolder, SelectionType } from '../lib'

import { Action } from '../app'
import { doSelect } from '../lib/doSelect'
import { getAtPath } from '../lib/utils/getAtPath'
import { paragraphSelection } from '../lib/utils/rangeSelection'

export interface SelectChangeArgs {
  holder: CompositionHolder
  selection: SelectionType
}

export const selectChange: Action<SelectChangeArgs> = (ctx, value) => {
  const { editor } = ctx.effects
  const { holder, selection } = value
  const comp = editor.ensureComposition(holder)
  const elem = getAtPath(comp, selection.anchorPath, true)
  if (!elem) {
    // Ignore selection out of composition
    return
  }

  editor.processOps({ holder, ops: doSelect(comp, selection) })
}

export interface SelectParagraphArgs {
  holder: CompositionHolder
  id: string
}

export const selectParagraph: Action<SelectParagraphArgs> = (
  ctx,
  { holder, id }
) => {
  const { editor } = ctx.effects
  const comp = editor.ensureComposition(holder)
  const elem = getAtPath(comp, [id], true)
  if (!elem) {
    return
  }
  editor.processOps({
    holder,
    ops: doSelect(comp, paragraphSelection(comp, id)),
    // ops: doSelect(comp, caretSelection([id], 0)),
  })
}
