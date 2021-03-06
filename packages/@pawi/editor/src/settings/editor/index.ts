import { paste } from './paste'
import { video } from './videoParagraph'
import { EditorSettings } from '../../types'

export const editor: EditorSettings['editor'] = {
  paragraphs: {
    video,
  },
  paste,
}
