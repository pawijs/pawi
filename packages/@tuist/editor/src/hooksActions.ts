import { CompositionType } from './lib'
import { editor_pasteEditor } from './types'
import { makeHook } from '@tuist/hooks'

export const hooksActions = {
  [editor_pasteEditor]: makeHook<{ composition: CompositionType }>(
    editor_pasteEditor
  ),
}
