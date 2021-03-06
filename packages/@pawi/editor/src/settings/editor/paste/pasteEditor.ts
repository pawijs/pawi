import { CompositionType, PasteArgs, PasteOperation } from '../../../lib'

import { Context } from '../../../app'
import { editor_pasteEditor } from '../../../types'
import { insertComposition } from '../../../lib/insertComposition'
import { makeOps } from '../../../lib/doOperation'

export async function doPasteEditor(
  ctx: Context,
  args: PasteArgs,
  composition: CompositionType
) {
  const { holder, selection } = args
  const done = await ctx.actions.hooks[editor_pasteEditor]({
    composition,
  })
  if (!done) {
    const comp = ctx.effects.editor.ensureComposition(holder)
    const ops = makeOps(
      insertComposition(comp, args.selection, composition),
      selection
    )
    ctx.effects.editor.processOps({ holder, ops })
    return true
  }
  return false
}

export const pasteEditor: PasteOperation = async function (
  ctx: Context,
  type,
  args
) {
  const text = args.event.clipboardData.getData(type)
  try {
    const composition = JSON.parse(text) as CompositionType
    if (!composition.g) {
      throw new Error(`Bad text`)
    }
    return await doPasteEditor(ctx, args, composition)
  } catch (err) {
    console.warn(err)
    console.warn(text)
    console.warn(`Not a valid composition. Cannot paste.`)
  }
  return false
}
