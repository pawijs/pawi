import { PASTE_EDITOR, PASTE_HTML, PASTE_TEXT } from '../../../lib/utils/types'

import { pasteEditor } from './pasteEditor'
import { pasteHtml } from './pasteHtml'
import { pasteText } from './pasteText'

// Order matters as we try from first to last.
export const paste = {
  [PASTE_EDITOR]: pasteEditor,
  [PASTE_HTML]: pasteHtml,
  [PASTE_TEXT]: pasteText,
}
