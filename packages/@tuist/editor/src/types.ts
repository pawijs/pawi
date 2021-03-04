import * as actions from './actions'
import * as effects from './effects'
import * as v2 from './v2/overmind'

import {
  CompositionHolder,
  CompositionType,
  EditorOptions,
  EditorProvider,
} from './lib/utils/types'

import { Hook } from '@tuist/hooks'
import { Reference } from '@tuist/build'
import { hooksActions } from './hooksActions'

export { CompositionHolder } from './lib/utils/types'
export const editor_pasteEditor = 'editor_pasteEditor'
export const SPACER = '\u200B'

// Family to display next to DragBar
export const editor_dragBar = 'editor_dragBar'

// Family to display in title extra
export const editor_titleExtra = 'editor_titleExtra'

// Drag type
export const dragParaType = 'editorPara'

export type EditorParaDrag = EditorParaRefDrag | EditorParaDataDrag

export function isParaRefDrag(
  value: EditorParaDrag
): value is EditorParaRefDrag {
  return (value as any).sourceRef !== undefined
}

export interface EditorParaDataDrag {
  // Custom paragraph definition
  c: string
  data: any
}

export interface EditorParaRefDrag {
  sourceRef: Reference<CompositionHolder>
  // Can be undefined if dragging did not start in an editor
  sourceCompId?: string
  // Source paragraph id
  sourceId: string
}

export interface EditorParaDrop {
  // Target
  holderRef: Reference<CompositionHolder>
  // Target compId
  compId: string
  // Target paragraph id (if empty => after current selection)
  id?: string
}

export interface UndoStore {
  store: string[]
  idx: number
  // Stores the document path. Store is reset if path changes.
  path: string
}

export interface EditorConfig {
  state: {
    editor: {
      store: UndoStore

      options: () => EditorProvider
    }
  }
  actions: {
    hooks: typeof hooksActions
    editor: typeof actions
    edit: typeof v2
  }
  effects: {
    editor: typeof effects
  }
}

export interface EditorHooks {
  [editor_pasteEditor]?: Hook<{ composition: CompositionType }>
}

export interface EditorSettings {
  editor?: EditorOptions
}
