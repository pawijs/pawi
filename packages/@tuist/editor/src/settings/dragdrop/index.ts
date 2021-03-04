import { DragdropSettings } from '@tuist/dragdrop'
import { DraggedParagraph } from '../../components'

export const dragdrop: DragdropSettings['dragdrop'] = {
  types: {
    editorPara: {
      component: DraggedParagraph,
    },
  },
}
