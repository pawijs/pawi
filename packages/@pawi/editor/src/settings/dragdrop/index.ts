import { DragdropSettings } from '@pawi/dragdrop'
import { DraggedParagraph } from '../../components'

export const dragdrop: DragdropSettings['dragdrop'] = {
  types: {
    editorPara: {
      component: DraggedParagraph,
    },
  },
}
