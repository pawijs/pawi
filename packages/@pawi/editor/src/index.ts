import { Block } from '@pawi/build'
import { dragdrop } from '@pawi/dragdrop'
import { hooks } from '@pawi/hooks'
import { locale } from '@pawi/locale'
import { shortcuts } from '@pawi/shortcuts'
import { styled } from '@pawi/styled'
import { theme } from '@pawi/theme'
import * as actions from './actions'
import * as effects from './effects'
import { hooksActions } from './hooksActions'
import { settings } from './settings'
import { setup } from './setup'
import { EditorConfig } from './types'
import * as v2 from './v2/overmind'

export * from './components'
export { ElementTag, ElementTagProps, getInputValue } from './components'
export * from './helpers'
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
