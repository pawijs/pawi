import { editor_dragBar, editor_titleExtra } from '../../types'

import { StyledSettings } from '@tuist/styled'
import { icons } from './icons'

export const styled: StyledSettings['styled'] = {
  family: {
    // Setup empty folder
    [editor_titleExtra]: {},
    // Setup empty folder
    [editor_dragBar]: {},
  },
  icons,
}
