import { makeHook } from '@pawi/hooks'
import { CompositionType } from './lib'
import { editor_pasteEditor } from './types'

export const hooksActions = {
  [editor_pasteEditor]: makeHook<{ composition: CompositionType }>(
    editor_pasteEditor
  ),
}
