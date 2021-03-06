import { Block, settings } from '@pawi/build'
import { theme, ThemeSettings } from '@pawi/theme'
import * as actions from './actions'
import { setup } from './setup'
import { dragdropTheme } from './theme'
import { DragdropConfig } from './types'

export * from './components'
export * from './draggable'
export * from './droppable'
export * from './fileDrop'
export * from './theme'
export * from './types'

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
