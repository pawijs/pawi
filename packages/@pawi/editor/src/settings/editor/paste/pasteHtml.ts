// @ts-ignore
import wordFilter from 'tinymce-word-paste-filter'
import { PasteOperation } from '../../..'
// import { fromHTML } from '../../../lib/fromHTML'
// import { PASTE_TEXT } from '../../../lib/utils/types'
// import { doPasteText } from './pasteText'
// import { doPasteEditor } from './pasteEditor'

export const pasteHtml: PasteOperation = async function (ctx, type, args) {
  // const { holder, event } = args
  // TEMPORARY HACK UNTIL WE MANAGE PROPER HTML PASTE
  return false
  /*
  // Ignore html for now.
  if (event.clipboardData.types.includes('text/rtf')) {
    // Paste from Word
    const html = wordFilter(event.clipboardData.getData(type))
    return doPasteEditor(ctx, args, fromHTML(html))
  } else if (event.clipboardData.types.includes(PASTE_TEXT)) {
    // Use text instead
    const text = event.clipboardData.getData(PASTE_TEXT)
    return doPasteText(ctx, { holder, text })
  } else {
    const html = event.clipboardData.getData(type)
    // Strip tags
    const text = html.replace(/(<([^>]+)>)/gi, '')
    return doPasteText(ctx, { holder, text })
  }
  */
}
