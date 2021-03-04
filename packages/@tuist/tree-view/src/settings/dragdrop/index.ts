import * as hooks from './hooks'

import { DragdropSettings } from '@tuist/dragdrop'
import { Nodes } from '../../components'

export const dragdrop: DragdropSettings['dragdrop'] = {
  types: {
    tree: {
      hooks,
      component: Nodes,
      dragProps: { noDrop: true },
    },
  },
}
