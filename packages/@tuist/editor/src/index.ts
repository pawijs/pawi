import * as actions from './actions'
import * as effects from './effects'
import * as v2 from './v2/overmind'

import { Block } from '@tuist/build'
import { EditorConfig } from './types'
import { dragdrop } from '@tuist/dragdrop'
import { hooks } from '@tuist/hooks'
import { hooksActions } from './hooksActions'
import { locale } from '@tuist/locale'
import { settings } from './settings'
import { setup } from './setup'
import { shortcuts } from '@tuist/shortcuts'
import { styled } from '@tuist/styled'
import { theme } from '@tuist/theme'

export * from './components'
export * from './helpers'
export { ElementTag, ElementTagProps, getInputValue } from './components'
export {
  CompositionType,
  EditorOptions,
  ElementType,
  getTitle,
  InitFunction,
  isTitle,
  newComposition,
  NewCompositionOptions,
  ParagraphOption,
  ParagraphProps,
  PasteArgs,
  PasteOperation,
} from './lib'
export { caretSelection } from './lib/utils/caretSelection'
export {
  CustomParagraphInfo,
  customParagraphs,
} from './lib/utils/customParagraphs'
export { firstId } from './lib/utils/firstId'
export { SortAscending as sortedIds } from './lib/utils/getNeighbours'
export { isEmptyComposition } from './lib/utils/isEmpty'
export { lastId } from './lib/utils/lastId'
export { rangeSelection } from './lib/utils/rangeSelection'
export { makeComposition, MakeComposition } from './lib/utils/testUtils'
export * from './paragraphs'
export { editorTheme } from './theme'
export * from './types'

export const editor: Block<EditorConfig> = {
  name: 'editor',
  dependencies: [dragdrop, hooks, locale, styled, shortcuts, theme],
  setup,
  settings,
  state: {
    editor: {
      store: {
        idx: 0,
        store: [],
        path: '',
      },
      // These are dummy value replaced
      options: {} as any,
    },
  },
  actions: {
    hooks: hooksActions,
    editor: actions,
    edit: v2,
  },
  effects: {
    editor: effects,
  },
}
