import * as actions from './actions'

import { Block, settings } from '@tuist/build'
import { ThemeSettings, theme } from '@tuist/theme'

import { DragdropConfig } from './types'
import { dragdropTheme } from './theme'
import { setup } from './setup'

export * from './components'
export * from './draggable'
export * from './droppable'
export * from './fileDrop'
export * from './types'
export * from './theme'

export const dragdrop: Block<DragdropConfig> = {
  name: 'dragdrop',
  dependencies: [theme],
  setup,
  settings: settings<ThemeSettings>({
    theme: {
      default: dragdropTheme,
    },
  }),
  state: {
    dragdrop: {
      // Mouse position
      position: { x: 0, y: 0 },
      definitions: () => ({
        types: {},
        dragTransform: {},
        dropTransform: {},
      }),
    },
  },
  actions: {
    dragdrop: actions,
  },
}
