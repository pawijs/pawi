import * as actions from './actions'

import { Block } from '@tuist/build'
import { TreeViewConfig } from './types'
import { dragdrop } from '@tuist/dragdrop'
import { locale } from '@tuist/locale'
import { settings } from './settings'
import { styled } from '@tuist/styled'
import { theme } from '@tuist/theme'
import { tree } from '@tuist/tree'

export * from './components'
export * from './settings/theme'
export * from './types'

export const treeView: Block<TreeViewConfig> = {
  name: 'treeView',
  dependencies: [tree, locale, theme, dragdrop, styled],
  settings,
  state: {
    treeView: {
      dropTarget: {},
      uimap: {},
    },
  },
  actions: {
    treeView: actions,
  },
}
