import { Block } from '@pawi/build'
import { dragdrop } from '@pawi/dragdrop'
import { locale } from '@pawi/locale'
import { styled } from '@pawi/styled'
import { theme } from '@pawi/theme'
import { tree } from '@pawi/tree'
import * as actions from './actions'
import { settings } from './settings'
import { TreeViewConfig } from './types'

export * from './components'
export * from './settings/theme'
export * from './types'

export const treeView: Block<TreeViewConfig> = {
  name: 'treeView',
  dependencies: [tree, locale, theme, dragdrop, styled],
  settings,
  state: {
    treeView: {
      library: [],
      dropTarget: {},
      uimap: {},
    },
  },
  actions: {
    treeView: actions,
  },
}
