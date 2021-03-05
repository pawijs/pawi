import { Block } from '@tuist/build'
import { dragdrop } from '@tuist/dragdrop'
import { locale } from '@tuist/locale'
import { styled } from '@tuist/styled'
import { theme } from '@tuist/theme'
import { tree } from '@tuist/tree'
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
